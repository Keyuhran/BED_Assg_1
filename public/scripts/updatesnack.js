
// Example usage
const updated = await Snack.updateSnack(
    1, // snackId
    "Updated Snack Name",
    "Updated Snack Description",
    5.99, // snackPrice
    "Updated Ingredients",
    "/path/to/updated-image.jpg",
    "Updated Country"
  );
  
  if (updated) {
    console.log("Snack updated successfully!");
  } else {
    console.log("Failed to update snack.");
  }
  