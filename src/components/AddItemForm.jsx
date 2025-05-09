
    import React, { useState } from "react";
    import { Input } from "@/components/ui/input";
    import { Button } from "@/components/ui/button";

    const AddItemForm = ({ onAddItem, inputPlaceholder, buttonText }) => {
      const [newItem, setNewItem] = useState("");

      const handleAddItemClick = () => {
        if (onAddItem(newItem)) {
          setNewItem(""); // Clear input only on success
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleAddItemClick();
        }
      };

      return (
        <div className="flex gap-2 mb-6">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder}
            className="flex-1"
          />
          <Button onClick={handleAddItemClick}>{buttonText}</Button>
        </div>
      );
    };

    export default AddItemForm;
  