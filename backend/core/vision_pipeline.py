import json
import os

class VisionPipeline:
    def __init__(self):
        self.landmarks = []
        self.load_data()

    def load_data(self):
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        with open(os.path.join(data_dir, 'landmarks.json'), 'r') as f:
            self.landmarks = json.load(f)

    def analyze_image(self, image_input: str):
        # In a real scenario, we'd run YOLO + VLM. 
        # Here we do a mocked keyword search on the image_input string.
        
        image_lower = image_input.lower()
        matched = []
        for lm in self.landmarks:
            if lm['type'].replace('_', ' ') in image_lower or lm['text'].lower() in image_lower:
                matched.append(lm)
                
        if matched:
            best_match = matched[0]
            return {
                "status": "success",
                "detections": ["room_sign", "corridor", "door"], # Mocked YOLO
                "vlm_interpretation": f"Scene matches {best_match['description']}.",
                "estimated_location": {
                    "node_id": best_match['node'],
                    "building": best_match['building'],
                    "floor": best_match['floor']
                },
                "confidence": "High"
            }
        else:
            return {
                "status": "low_confidence",
                "message": "Unable to uniquely identify location from the image. Please select on map."
            }

vision_pipeline = VisionPipeline()
