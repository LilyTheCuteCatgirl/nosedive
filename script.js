let currentRating = 4.2;
let numRatings = 10;

function rate(stars) {
  currentRating = ((currentRating * numRatings) + stars) / (numRatings + 1);
  numRatings += 1;
  document.getElementById("rating").textContent = currentRating.toFixed(1);
}
