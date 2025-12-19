from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from .utils import ModelWrapper

# Initialize FastAPI app
app = FastAPI(
    title="ForReal API",
    description="AI-generated image detection API",
    version="1.0.0"
)

# CORS - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        model = ModelWrapper()
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "ForReal API is running"}


@app.get("/health")
async def health():
    """Health check with model status"""
    return {
        "status": "ok",
        "model_loaded": model is not None
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Upload an image and get AI detection prediction.
    
    Returns:
        - label: "REAL" or "AI"
        - index: 0 for REAL, 1 for AI
        - probabilities: [prob_real, prob_ai]
        - confidence: confidence percentage
    """
    # Validate model is loaded
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Validate file extension
    allowed_extensions = {"png", "jpg", "jpeg", "gif", "webp", "bmp"}
    file_ext = file.filename.split(".")[-1].lower() if file.filename else ""
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Allowed formats: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Read image bytes
        contents = await file.read()
        
        # Open as PIL Image
        pil_image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary (handles PNG with alpha, grayscale, etc.)
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
        
        # Run prediction
        result = model.predict(pil_image)
        
        # Add confidence percentage
        probs = result["probabilities"]
        confidence = max(probs) * 100
        
        return {
            "label": result["label"],
            "index": result["index"],
            "probabilities": probs,
            "confidence": round(confidence, 2),
            "filename": file.filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")









