import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "../../ui/Slider";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { MoveIcon, DownloadIcon, Search, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { Alert, AlertDescription } from "../../ui/Alert";

const ImageSignatureComponent = () => {
  // State for position, dragging, and images
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Size controls for images
  const [signatureSize, setSignatureSize] = useState(100);
  const [baseImageSize, setBaseImageSize] = useState(100);
  
  // Image URLs and error handling
  const [baseImageUrl, setBaseImageUrl] = useState("");
  const [signatureImageUrl, setSignatureImageUrl] = useState("");
  const [error, setError] = useState("");
  const [extractedText, setExtractedText] = useState("");

  // Refs for canvas and images
  const canvasRef = useRef(null);
  const baseImage = useRef(null);
  const signatureImage = useRef(null);
  const originalBaseDimensions = useRef({ width: 800, height: 600 });

  // Handle file uploads
  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (type === 'base') {
          setBaseImageUrl(e.target.result);
          baseImage.current = img;
          originalBaseDimensions.current = {
            width: img.width,
            height: img.height
          };
          setBaseImageSize(100);
        } else {
          setSignatureImageUrl(e.target.result);
          signatureImage.current = img;
          setSignatureSize(100);
          // Center signature
          setPosition({
            x: (canvasRef.current.width - img.width) / 2,
            y: (canvasRef.current.height - img.height) / 2
          });
        }
        updateCanvas();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    setError("");
  };

  // Canvas drawing function
  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw base image
    if (baseImage.current) {
      const baseScale = baseImageSize / 100;
      const scaledWidth = originalBaseDimensions.current.width * baseScale;
      const scaledHeight = originalBaseDimensions.current.height * baseScale;
      
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(baseImage.current, x, y, scaledWidth, scaledHeight);
    }
    
    // Draw signature
    if (signatureImage.current) {
      const scale = signatureSize / 100;
      const width = signatureImage.current.width * scale;
      const height = signatureImage.current.height * scale;
      ctx.drawImage(
        signatureImage.current,
        position.x,
        position.y,
        width,
        height
      );
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (!signatureImage.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDragging(true);
    setDragStart({ x: x - position.x, y: y - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPosition({
      x: x - dragStart.x,
      y: y - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    if (!signatureImage.current) return;
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x: x - position.x, y: y - position.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setPosition({
      x: x - dragStart.x,
      y: y - dragStart.y
    });
  };

  // Download merged image
  const handleDownload = () => {
    if (!baseImage.current) {
      setError("Please upload a base image first");
      return;
    }
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'signed-document.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Extract text (placeholder function)
  const extractText = () => {
    if (!signatureImage.current) {
      setError("Please upload a signature image first");
      return;
    }
    setExtractedText("Sample extracted signature text");
  };

  // Handle canvas resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      
      canvas.width = Math.min(800, containerWidth - 20);
      canvas.height = (canvas.width * 300) / 800;
      
      updateCanvas();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Update canvas when relevant states change
  useEffect(() => {
    updateCanvas();
  }, [position, signatureSize, baseImageSize]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg sm:text-xl">Sign Document</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Document</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'base')}
                    className="hidden"
                    id="base-image-upload"
                  />
                  <label
                    htmlFor="base-image-upload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Document</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Signature</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'signature')}
                    className="hidden"
                    id="signature-upload"
                  />
                  <label
                    htmlFor="signature-upload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Signature</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="relative border rounded-lg overflow-hidden bg-gray-50 flex justify-center items-center">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                className="touch-none cursor-move"
              />
              {signatureImage.current && (
                <div className="absolute top-2 right-2 bg-white/80 rounded p-1">
                  <MoveIcon className="w-5 h-5 text-gray-600" />
                </div>
              )}
              {!baseImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm text-center px-4">
                  Upload a document to start
                </div>
              )}
            </div>

            {baseImage.current && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" />
                  <label className="text-sm font-medium">Document Size ({baseImageSize}%)</label>
                  <ZoomIn className="w-4 h-4" />
                </div>
                <Slider
                  value={[baseImageSize]}
                  onValueChange={(value) => setBaseImageSize(value[0])}
                  min={10}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            {signatureImage.current && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" />
                  <label className="text-sm font-medium">Signature Size ({signatureSize}%)</label>
                  <ZoomIn className="w-4 h-4" />
                </div>
                <Slider
                  value={[signatureSize]}
                  onValueChange={(value) => setSignatureSize(value[0])}
                  min={5}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={extractText}
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
                disabled={!signatureImage.current}
              >
                <Search className="w-4 h-4" />
                Extract Text from Signature
              </Button>
              {extractedText && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{extractedText}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageSignatureComponent;
