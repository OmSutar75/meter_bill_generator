import React, { useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import "./BillCalculatorPage.css";

export interface BillRecord {
  id?: string | number;
  generatedAt?: string;
  oldReading: number;
  newReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  totalBill: number;
}

interface BillCalculatorProps {
  onSaveBill?: (
    bill: Omit<BillRecord, "id" | "generatedAt">,
  ) => Promise<BillRecord | void>;
  onNavigateToHistory?: () => void;
  onLogout?: () => void; // Added onLogout prop
}

export const BillCalculatorPage: React.FC<BillCalculatorProps> = ({
  onSaveBill,
  onNavigateToHistory,
  onLogout,
}) => {
  const [oldReading, setOldReading] = useState<string>("");
  const [newReading, setNewReading] = useState<string>("");
  const [ratePerUnit, setRatePerUnit] = useState<string>("");

  const [billResult, setBillResult] = useState<BillRecord | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const oldVal = parseFloat(oldReading);
    const newVal = parseFloat(newReading);
    const rateVal = parseFloat(ratePerUnit);

    if (newVal < oldVal) {
      alert("New reading cannot be less than old reading!");
      return;
    }

    const units = newVal - oldVal;
    const total = units * rateVal;

    setBillResult({
      oldReading: oldVal,
      newReading: newVal,
      unitsConsumed: units,
      ratePerUnit: rateVal,
      totalBill: total,
    });
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!billResult || !onSaveBill) {
      return;
    }
    try {
      setIsSaving(true);
      const savedBill = await onSaveBill({
        oldReading: billResult.oldReading,
        newReading: billResult.newReading,
        unitsConsumed: billResult.unitsConsumed,
        ratePerUnit: billResult.ratePerUnit,
        totalBill: billResult.totalBill,
      });
      if (savedBill) {
        setBillResult(savedBill);
      }
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save the bill. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="calculator-container">
      <div className="pixel-card">
        <div className="pixel-header">
          <h1 className="pixel-title">BILL CALCULATOR</h1>
          <p className="pixel-subtitle">CALCULATE ELECTRICITY BILL</p>
        </div>

        <form className="calculator-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="pixel-label" htmlFor="oldReading">
              Old Reading
            </label>
            <input
              id="oldReading"
              type="number"
              step="any"
              className="pixel-input"
              value={oldReading}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setOldReading(e.target.value)
              }
              placeholder="e.g. 1200"
              required
            />
          </div>

          <div className="form-group">
            <label className="pixel-label" htmlFor="newReading">
              New Reading
            </label>
            <input
              id="newReading"
              type="number"
              step="any"
              className="pixel-input"
              value={newReading}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewReading(e.target.value)
              }
              placeholder="e.g. 1350"
              required
            />
          </div>

          <div className="form-group">
            <label className="pixel-label" htmlFor="ratePerUnit">
              Rate Per Unit (₹)
            </label>
            <input
              id="ratePerUnit"
              type="number"
              step="any"
              className="pixel-input"
              value={ratePerUnit}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRatePerUnit(e.target.value)
              }
              placeholder="e.g. 8"
              required
            />
          </div>

          <button type="submit" className="pixel-button">
            CALCULATE BILL
          </button>
        </form>

        {billResult && (
          <div className="bill-summary">
            <h2 className="summary-title">--- BILL RECEIPT ---</h2>
            <div className="summary-row">
              <span>OLD READING:</span>
              <span>{billResult.oldReading}</span>
            </div>
            <div className="summary-row">
              <span>NEW READING:</span>
              <span>{billResult.newReading}</span>
            </div>
            <div className="summary-row">
              <span>UNITS USED:</span>
              <span>{billResult.unitsConsumed}</span>
            </div>
            <div className="summary-row">
              <span>RATE/UNIT:</span>
              <span>₹ {billResult.ratePerUnit.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>TOTAL AMOUNT:</span>
              <span>₹ {billResult.totalBill.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="pixel-button"
              style={{
                marginTop: "12px",
                backgroundColor: isSaved
                  ? "var(--ink-gray)"
                  : "var(--ink-blue)",
                color: isSaved ? "var(--ink-charcoal)" : "var(--ink-ivory)",
              }}
              onClick={handleSave}
              disabled={isSaved || isSaving}
            >
              {isSaving ? "SAVING..." : isSaved ? "SAVED ✓" : "SAVE BILL"}
            </button>
          </div>
        )}

        {/* Action button container - aligns buttons side by side */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          {onNavigateToHistory && (
            <button
              type="button"
              className="pixel-button"
              style={{
                flex: 1,
                backgroundColor: "var(--ink-charcoal)",
              }}
              onClick={onNavigateToHistory}
            >
              VIEW HISTORY
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              className="pixel-button"
              style={{
                flex: 1,
                backgroundColor: "#8b0000", // Crimson red for logout action
                color: "#fff",
              }}
              onClick={onLogout}
            >
              LOGOUT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillCalculatorPage;
