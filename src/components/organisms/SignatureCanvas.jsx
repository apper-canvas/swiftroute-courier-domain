import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SignatureCanvas = ({ onSave, onClear }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    setIsDrawing(true);
    setHasSignature(true);

    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onClear && onClear();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    onSave && onSave(dataUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-secondary flex items-center gap-2">
              <ApperIcon name="PenTool" size={20} className="text-primary" />
              Customer Signature
            </h3>
          </div>

          <div className="border-2 border-dashed border-secondary/20 rounded-lg p-2 bg-secondary/5">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className="w-full cursor-crosshair bg-white rounded"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={clearCanvas}
              disabled={!hasSignature}
              className="flex-1"
            >
              <ApperIcon name="RotateCcw" size={16} />
              Clear
            </Button>
            <Button
              variant="primary"
              onClick={saveSignature}
              disabled={!hasSignature}
              className="flex-1"
            >
              <ApperIcon name="Check" size={16} />
              Save Signature
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default SignatureCanvas;