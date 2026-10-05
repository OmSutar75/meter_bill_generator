import React from "react";
import "./BillHistory.css";

export interface BillRecord {
  id?: number | string;
  generatedAt?: string;
  oldReading: number;
  newReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  totalBill: number;
}

interface BillHistoryProps {
  history: BillRecord[];
  onBackToCalculator?: () => void;
}

export const BillHistoryPage: React.FC<BillHistoryProps> = ({
  history,
  onBackToCalculator,
}) => {
  return (
    <div className="history-container">
      <div className="pixel-card">
        <div className="pixel-header">
          <h1 className="pixel-title">BILL HISTORY</h1>
          <p className="pixel-subtitle">PAST GENERATED RECORDS</p>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-state">NO BILL RECORDS FOUND</div>
          ) : (
            history.map((bill) => (
              <div key={bill.id} className="history-item">
                <div className="history-item-header">
                  <span className="bill-id">#{bill.id}</span>
                  <span className="bill-timestamp">{bill.generatedAt}</span>
                </div>

                <div className="history-item-details">
                  <div className="detail-row">
                    <span>OLD:</span>
                    <span>{bill.oldReading}</span>
                  </div>
                  <div className="detail-row">
                    <span>NEW:</span>
                    <span>{bill.newReading}</span>
                  </div>
                  <div className="detail-row">
                    <span>UNITS:</span>
                    <span>{bill.unitsConsumed}</span>
                  </div>
                  <div className="detail-row">
                    <span>RATE:</span>
                    <span>₹{bill.ratePerUnit.toFixed(2)}</span>
                  </div>
                </div>

                <div className="history-item-total">
                  <span>TOTAL BILL:</span>
                  <span>₹ {bill.totalBill.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {onBackToCalculator && (
          <button
            type="button"
            className="pixel-button"
            onClick={onBackToCalculator}
          >
            BACK TO CALCULATOR
          </button>
        )}
      </div>
    </div>
  );
};

export default BillHistoryPage;
