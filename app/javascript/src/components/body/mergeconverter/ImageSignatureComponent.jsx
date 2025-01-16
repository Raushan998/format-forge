import React, { useState, useRef, useEffect } from 'react';
import { Slider } from "../../ui/Slider";
import { Button } from "../../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { MoveIcon, DownloadIcon, Search, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { Alert, AlertDescription } from "../../ui/Alert";

const ImageSignatureComponent = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [signatureSize, setSignatureSize] = useState(100);
  const [baseImageSize, setBaseImageSize] = useState(100);
  const [extractedText, setExtractedText] = useState("");
  const [baseImageUrl, setBaseImageUrl] = useState(null);
  const [signatureImageUrl, setSignatureImageUrl] = useState(null);
  const [error, setError] = useState("");
  
  const canvasRef = useRef(null);
  const baseImage = useRef(null);
  const signatureImage = useRef(null);
  const originalBaseDimensions = useRef({ width: 400, height: 300 });

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
          // Store original dimensions
          originalBaseDimensions.current = {
            width: img.width,
            height: img.height
          };
          // Reset base image size when new image is uploaded
          setBaseImageSize(100);
        } else {
          setSignatureImageUrl(e.target.result);
          signatureImage.current = img;
          // Reset signature size when new image is uploaded
          setSignatureSize(100);
          // Center signature position
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
      
      // Center the base image
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

  useEffect(() => {
    updateCanvas();
  }, [position, signatureSize, baseImageSize]);

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

  const handleDownload = () => {
    if (!baseImage.current) {
      setError("Please upload a base image first");
      return;
    }
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'merged-image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const extractText = async () => {
    if (!signatureImage.current) {
      setError("Please upload a signature image first");
      return;
    }
    setExtractedText("Sample extracted signature text");
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-8 bg-gray-100">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Image Signature Merger
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Download
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
                <label className="block text-sm font-medium mb-2">Base Image</label>
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
                    Upload Base Image
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Signature Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'signature')}
                    className="hidden"
                    id="signature-image-upload"
                  />
                  <label
                    htmlFor="signature-image-upload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Signature
                  </label>
                </div>
              </div>
            </div>

            <div className="relative border rounded-lg overflow-hidden bg-gray-50 flex justify-center items-center" style={{ height: '300px', marginTop: '50px' }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={300}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="cursor-move"
              />
              {signatureImage.current && (
                <div className="absolute top-2 right-2 bg-white/80 rounded p-1">
                  <MoveIcon className="w-5 h-5 text-gray-600" />
                </div>
              )}
              {!baseImageUrl && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Upload a base image to start
                </div>
              )}
            </div>

            {baseImage.current && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ZoomOut className="w-4 h-4" />
                  <label className="text-sm font-medium">Base Image Size ({baseImageSize}%)</label>
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
                className="flex items-center gap-2"
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
