import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { analyzeImage } from '../services/api';

export const VisionDemoPage: React.FC = () => {
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Using dummy files to simulate the demo since we don't have actual images uploaded
    const handleSimulatedUpload = async (filename: string) => {
        setIsLoading(true);
        try {
            // Mocking a file object just to pass the filename
            const file = new File(["dummy content"], filename, { type: "image/jpeg" });
            const res = await analyzeImage(file);
            setResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Vision Localization Demo</h1>
            <p className="text-gray-600 mb-8">Upload an image to identify your location automatically using simulated YOLO + VLM.</p>

            <div className="grid grid-cols-2 gap-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 text-center min-h-[300px]">
                    <Camera size={48} className="text-gray-400 mb-4" />
                    <h3 className="font-semibold text-lg text-gray-700">Simulate Upload</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">Select a demo scene to test the vision pipeline</p>
                    
                    <div className="space-y-3 w-full">
                        <button 
                            onClick={() => handleSimulatedUpload("corridor_204_sign.jpg")}
                            className="w-full bg-white border border-gray-300 rounded p-3 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                            <Upload size={16} className="mr-2" />
                            Image: Room 204 Sign
                        </button>
                        <button 
                            onClick={() => handleSimulatedUpload("staircase_b_view.jpg")}
                            className="w-full bg-white border border-gray-300 rounded p-3 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                            <Upload size={16} className="mr-2" />
                            Image: Staircase B
                        </button>
                        <button 
                            onClick={() => handleSimulatedUpload("blurry_wall.jpg")}
                            className="w-full bg-white border border-gray-300 rounded p-3 hover:bg-blue-50 transition-colors text-sm font-medium flex items-center justify-center"
                        >
                            <Upload size={16} className="mr-2" />
                            Image: Blurry Wall (Low Conf)
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 min-h-[300px]">
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Pipeline Results</h2>
                    
                    {isLoading && (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-20 bg-gray-200 rounded w-full"></div>
                        </div>
                    )}

                    {!isLoading && !result && (
                        <div className="text-gray-400 flex items-center justify-center h-full">
                            Waiting for image input...
                        </div>
                    )}

                    {!isLoading && result && result.status === 'success' && (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded p-4 flex items-start">
                                <CheckCircle2 className="text-green-600 mr-3 mt-1" />
                                <div>
                                    <h4 className="font-bold text-green-900">Localization Successful</h4>
                                    <p className="text-green-800 text-sm mt-1">Confidence: {result.confidence}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-700 text-sm mb-1">Detected Objects (YOLO)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.detections.map((d:string, i:number) => (
                                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">{d}</span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 text-sm mb-1">Scene Understanding (VLM)</h4>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 border rounded">{result.vlm_interpretation}</p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 text-sm mb-1">Matched Spatial Node</h4>
                                <div className="bg-gray-800 text-white p-3 rounded font-mono text-sm">
                                    <p>Node ID: {result.estimated_location.node_id}</p>
                                    <p>Building: {result.estimated_location.building}</p>
                                    <p>Floor: {result.estimated_location.floor}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLoading && result && result.status === 'low_confidence' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 flex items-start">
                            <AlertCircle className="text-yellow-600 mr-3 mt-1" />
                            <div>
                                <h4 className="font-bold text-yellow-900">Low Confidence</h4>
                                <p className="text-yellow-800 text-sm mt-1">{result.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
