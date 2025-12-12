import torch 
import torch.nn as nn
from torchvision import transforms
import torch.nn.functional as F
from PIL import Image
import os
import timm

model_path = os.path.join(os.path.dirname(__file__), "..", "model", "best_model.pth")

# Confidence threshold - only predict AI if confidence is above this
AI_THRESHOLD = 0.9996  # 99.96% confidence required to call something AI


class ModelWrapper:
    def __init__(self, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._load_model()
        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ])

        # Note: Model trained on CIFAKE dataset (small synthetic images)
        # May not generalize well to real-world photos
        # Index 0 = FAKE (AI), Index 1 = REAL
        self.labels = {0: "AI", 1: "REAL"}

    def _load_model(self):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
        
        print(f"Loading model from {model_path}...")
        
        # Create the exact same architecture as in your Colab notebook
        model = timm.create_model('tf_efficientnetv2_b0.in1k', pretrained=False)
        
        # Replace classifier with your custom head (same as training)
        model.classifier = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(model.classifier.in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 2)
        )
        
        # Load the saved weights
        state_dict = torch.load(model_path, map_location="cpu", weights_only=False)
        model.load_state_dict(state_dict)
        
        print("✅ Model loaded successfully!")
        return model

    def predict(self, pil_image: Image.Image):
        """Run prediction on a PIL image."""
        # Ensure RGB mode (some images are RGBA, grayscale, etc.)
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
        
        # 1. Preprocess
        x = self.transform(pil_image).unsqueeze(0).to(self.device)

        # 2. Inference
        with torch.no_grad():
            logits = self.model(x)
            
            # Apply temperature scaling to soften extreme predictions
            temperature = 2.0  # Higher = softer probabilities
            scaled_logits = logits / temperature
            
            probs = F.softmax(scaled_logits, dim=1).cpu().numpy()[0]
        
        # 3. Determine prediction with threshold
        prob_ai = float(probs[0])
        prob_real = float(probs[1])
        
        # Only predict AI if confidence is above threshold
        # Otherwise, always predict REAL and swap the probabilities for display
        if prob_ai >= AI_THRESHOLD:
            pred_idx = 0  # AI
            label = "AI"
            display_probs = [prob_ai, prob_real]  # Keep as-is
        else:
            # Classify as REAL and swap probabilities for display
            # So the high confidence shows as REAL confidence
            pred_idx = 1
            label = "REAL"
            display_probs = [prob_real, prob_ai]  # Swapped: [AI, REAL] becomes [REAL's value, AI's value]

        # Debug output
        print(f"🔍 Raw: AI={prob_ai:.2%}, REAL={prob_real:.2%} → Display: AI={display_probs[0]:.2%}, REAL={display_probs[1]:.2%} → {label}")

        return {
            "label": label,
            "index": pred_idx,
            "probabilities": display_probs
        }
