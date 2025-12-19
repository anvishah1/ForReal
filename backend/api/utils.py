import torch 
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import os

# Path to the new DenseNet121 model trained on 140k Real vs Fake Faces
model_path = os.path.join(os.path.dirname(__file__), "..", "model", "best_densenet121_unfreeze_lastblock.pth")


class ModelWrapper:
    def __init__(self, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._load_model()
        self.model.to(self.device)
        self.model.eval()

        # Same transforms as training
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ])

        # From training: classes = ['fake', 'real']
        # Sigmoid output >= 0.5 → REAL (class 1)
        # Sigmoid output < 0.5 → FAKE (class 0)

    def _load_model(self):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")
        
        print(f"Loading model from {model_path}...")
        
        # Create DenseNet121 with custom classifier (same as training)
        model = models.densenet121(weights=None)
        model.classifier = nn.Sequential(
            nn.Linear(1024, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(0.3),
            nn.Linear(512, 1)
        )
        
        # Load the saved weights
        state_dict = torch.load(model_path, map_location="cpu", weights_only=False)
        model.load_state_dict(state_dict)
        
        print("✅ Model loaded successfully!")
        return model

    def predict(self, pil_image: Image.Image):
        """Run prediction on a PIL image."""
        # Ensure RGB mode
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
        
        # 1. Preprocess
        x = self.transform(pil_image).unsqueeze(0).to(self.device)

        # 2. Inference
        with torch.no_grad():
            output = self.model(x).squeeze()  # Single value
            prob_real = torch.sigmoid(output).item()  # Probability of being REAL
            prob_fake = 1.0 - prob_real  # Probability of being FAKE/AI
        
        # 3. Determine prediction
        # Sigmoid >= 0.5 means REAL, < 0.5 means FAKE
        if prob_real >= 0.5:
            label = "REAL"
            confidence = prob_real
        else:
            label = "AI"
            confidence = prob_fake

        # Debug output
        print(f"🔍 Probs: FAKE={prob_fake:.2%}, REAL={prob_real:.2%} → {label} ({confidence:.2%})")

        return {
            "label": label,
            "index": 0 if label == "AI" else 1,
            "probabilities": [prob_fake, prob_real],  # [AI/FAKE, REAL]
            "confidence": round(confidence * 100, 2)
        }
