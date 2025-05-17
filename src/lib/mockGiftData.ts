export const getMockGiftIdeas = (occasion: string, interests: string[]) => {
  // Create a consistent but seemingly "generated" response based on inputs
  const interestString = interests.join("+");
  const seed = occasion + interestString;

  return [
    {
      title: `${getRandomTitle(seed, 0)} ${interests[0] || "Gift"}`,
      description: `Perfect for ${occasion.toLowerCase()} celebrations, this gift combines their love of ${
        interests[0] || "special things"
      } with practicality. It's thoughtfully designed to bring joy for years to come.`,
      price: getRandomPrice(seed, 0),
    },
    {
      title: `${getRandomTitle(seed, 1)} Experience`,
      description: `This unique ${
        interests.length > 1 ? interests[1] : interests[0] || "interest"
      }-based experience creates lasting memories. It's the perfect way to celebrate ${occasion.toLowerCase()} with something meaningful.`,
      price: getRandomPrice(seed, 1),
    },
    {
      title: `Curated ${
        interests.length > 0 ? interests[0] : "Gift"
      } Collection`,
      description: `A hand-selected assortment of premium items related to their passion for ${
        interests.length > 0 ? interests[0] : "interests"
      }. Each piece is chosen for quality and enjoyment.`,
      price: getRandomPrice(seed, 2),
    },
    {
      title: `Personalized ${interests.length > 1 ? interests[1] : "Gift"} Kit`,
      description: `Customized specifically for their unique taste and love of ${
        interests.length > 1
          ? interests[1]
          : interests[0] || "special interests"
      }. This thoughtful gift shows how well you know them.`,
      price: getRandomPrice(seed, 3),
    },
  ];
};

function getRandomTitle(seed: string, index: number) {
  const titles = [
    "Premium",
    "Ultimate",
    "Luxury",
    "Classic",
    "Essential",
    "Custom",
    "Artisan",
    "Signature",
    "Handcrafted",
    "Elite",
  ];
  // Create a deterministic but seemingly random selection
  const seedNum = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return titles[(seedNum + index) % titles.length];
}

function getRandomPrice(seed: string, index: number) {
  const prices = [
    "Budget-friendly ($20-$50)",
    "Mid-range ($50-$150)",
    "Premium ($150-$300)",
    "Luxury ($300+)",
  ];
  const seedNum = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return prices[(seedNum + index) % prices.length];
}
