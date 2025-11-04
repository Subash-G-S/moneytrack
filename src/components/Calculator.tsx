import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | number>("");

  const handleClick = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculateResult = () => {
    try {
      // evaluate safely
      // eslint-disable-next-line no-eval
      const res = eval(expression);
      setResult(res);
    } catch {
      setResult("Error");
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          💡 Quick Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          className="text-lg font-medium"
        />
        <div className="grid grid-cols-4 gap-2">
          {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((key) => (
            <Button
              key={key}
              variant={key === "=" ? "default" : "outline"}
              className="text-lg"
              onClick={() =>
                key === "=" ? calculateResult() : handleClick(key)
              }
            >
              {key}
            </Button>
          ))}
          <Button
            variant="destructive"
            className="col-span-2"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            variant="secondary"
            className="col-span-2"
            onClick={handleBackspace}
          >
            ⌫
          </Button>
        </div>

        {result !== "" && (
          <div className="text-right text-xl font-semibold mt-4">
            = {result}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

