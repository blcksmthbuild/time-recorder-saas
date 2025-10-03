import React from "react";

const TimeLogApp: React.FC = () => {
  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #007bff",
        borderRadius: "8px",
      }}
    >
      <h2>⏱️ Óranyilvántartó MODUL (Remote Container)</h2>
      <p>
        Ez a tartalom a *különálló Docker konténerből* lett betöltve (Micro
        Frontend).
      </p>
    </div>
  );
};

export default TimeLogApp;
