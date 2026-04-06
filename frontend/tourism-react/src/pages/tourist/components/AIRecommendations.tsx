import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../../components/Toast";
import LoadingSpinner from "../../../components/LoadingSpinner";

interface RecommendationPreferences {
  budget: string;
  travelDates: {
    startDate: string;
    endDate: string;
  };
  interests: string[];
  groupSize: number;
  travelStyle: string;
  accommodation: string;
  activities: string[];
}

interface RecommendedPackage {
  id: number;
  name: string;
  location: string;
  price: number;
  duration: number;
  rating: number;
  image: string;
  matchScore: number;
  matchReasons: string[];
  highlights: string[];
}

interface CustomQuery {
  freeText: string;
  budgetMin?: number;
  budgetMax?: number;
  startDate?: string;
  endDate?: string;
  destination?: string;
  travelers?: number;
}

interface QuickQuestion {
  id: string;
  question: string;
  icon: string;
  category: string;
}

interface AIRecommendationsProps {
  showPreferencesForm?: boolean;
  maxRecommendations?: number;
}

type InputMode = "quick-questions" | "structured-form" | "custom-input";

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  showPreferencesForm = true,
  maxRecommendations = 6,
}) => {
  const { showToast } = useToast();

  const [inputMode, setInputMode] = useState<InputMode>("quick-questions");
  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    budget: "",
    travelDates: {
      startDate: "",
      endDate: "",
    },
    interests: [],
    groupSize: 1,
    travelStyle: "",
    accommodation: "",
    activities: [],
  });

  const [customQuery, setCustomQuery] = useState<CustomQuery>({
    freeText: "",
    budgetMin: undefined,
    budgetMax: undefined,
    startDate: undefined,
    endDate: undefined,
    destination: undefined,
    travelers: 1,
  });

  const [recommendations, setRecommendations] = useState<RecommendedPackage[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(showPreferencesForm);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");

  // Quick Questions for Q&A style interaction
  const quickQuestions: QuickQuestion[] = [
    {
      id: "best-destinations",
      question: "What are the best destinations in Nigeria?",
      icon: "🗺️",
      category: "destinations",
    },
    {
      id: "budget-friendly",
      question: "Show me budget-friendly packages",
      icon: "💰",
      category: "budget",
    },
    {
      id: "family-trips",
      question: "What are good family vacation spots?",
      icon: "👨‍👩‍👧‍👦",
      category: "family",
    },
    {
      id: "adventure",
      question: "I want adventure and outdoor activities",
      icon: "🏔️",
      category: "adventure",
    },
    {
      id: "cultural",
      question: "Show me cultural and historical tours",
      icon: "🏛️",
      category: "culture",
    },
    {
      id: "weekend",
      question: "Quick weekend getaway ideas?",
      icon: "⏰",
      category: "duration",
    },
    {
      id: "luxury",
      question: "Luxury travel experiences available?",
      icon: "💎",
      category: "luxury",
    },
    {
      id: "beach",
      question: "Best beach destinations?",
      icon: "🏖️",
      category: "beach",
    },
  ];

  const interestOptions = [
    "Culture & History",
    "Nature & Wildlife",
    "Adventure Sports",
    "Food & Cuisine",
    "Photography",
    "Shopping",
    "Nightlife",
    "Religious Sites",
    "Architecture",
    "Local Markets",
    "Festivals",
    "Beach & Water Sports",
  ];

  const activityOptions = [
    "Hiking",
    "City Tours",
    "Museum Visits",
    "Safari",
    "Water Sports",
    "Cultural Shows",
    "Food Tours",
    "Shopping Tours",
    "Photography Tours",
    "Adventure Activities",
    "Relaxation",
    "Educational Tours",
  ];

  // Mock AI recommendations
  const mockRecommendations: RecommendedPackage[] = [
    {
      id: 1,
      name: "Lagos Cultural Heritage Tour",
      location: "Lagos, Nigeria",
      price: 45000,
      duration: 3,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      matchScore: 95,
      matchReasons: [
        "Matches your culture interest",
        "Within budget range",
        "Perfect for group size",
      ],
      highlights: [
        "National Theatre",
        "Lekki Beach",
        "Local Markets",
        "Traditional Cuisine",
      ],
    },
    {
      id: 2,
      name: "Abuja Adventure Package",
      location: "Abuja, Nigeria",
      price: 65000,
      duration: 4,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=250&fit=crop",
      matchScore: 88,
      matchReasons: [
        "Adventure activities included",
        "Great for photography",
        "Luxury accommodation",
      ],
      highlights: [
        "Aso Rock Climbing",
        "Millennium Park",
        "Government District",
        "Fine Dining",
      ],
    },
    {
      id: 3,
      name: "Kano Historical Journey",
      location: "Kano, Nigeria",
      price: 55000,
      duration: 3,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      matchScore: 82,
      matchReasons: [
        "Rich historical content",
        "Cultural immersion",
        "Educational value",
      ],
      highlights: [
        "Ancient City Walls",
        "Emir's Palace",
        "Traditional Crafts",
        "Historic Mosques",
      ],
    },
    {
      id: 4,
      name: "Calabar Beach Escape",
      location: "Calabar, Nigeria",
      price: 38000,
      duration: 2,
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      matchScore: 90,
      matchReasons: [
        "Perfect beach destination",
        "Budget-friendly option",
        "Great for relaxation",
      ],
      highlights: [
        "Pristine Beaches",
        "Water Sports",
        "Seafood Cuisine",
        "Carnival Culture",
      ],
    },
    {
      id: 5,
      name: "Yankari Wildlife Safari",
      location: "Bauchi, Nigeria",
      price: 72000,
      duration: 5,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=250&fit=crop",
      matchScore: 87,
      matchReasons: [
        "Unique wildlife experience",
        "Adventure and nature",
        "Educational safari",
      ],
      highlights: [
        "Elephant Watching",
        "Natural Springs",
        "Game Drives",
        "Bird Watching",
      ],
    },
  ];

  // Mock AI response generator for custom queries
  // TODO: Replace with actual AI backend integration
  const generateMockAIResponse = (query: CustomQuery | string): string => {
    const responses = {
      "best-destinations":
        "Based on current trends and traveler reviews, the top destinations in Nigeria include Lagos for its vibrant culture and beaches, Abuja for modern attractions and government sites, Calabar for pristine beaches and the famous carnival, and Yankari National Park for wildlife enthusiasts. Each offers unique experiences tailored to different interests.",
      "budget-friendly":
        "I've found several excellent budget-friendly options for you! Packages under ₦50,000 include weekend getaways to Calabar beaches, cultural tours in Kano, and nature trips to Olumo Rock. These packages offer great value while maintaining quality experiences.",
      "family-trips":
        "For family vacations, I recommend destinations with diverse activities suitable for all ages. Lagos offers beaches and theme parks, Abuja has educational museums and parks, while Calabar provides beach fun and cultural experiences. All packages include family-friendly accommodations and activities.",
      adventure:
        "Adventure seekers will love our outdoor activity packages! Options include rock climbing at Aso Rock in Abuja, hiking expeditions in Jos Plateau, water sports in Calabar, and wildlife safaris at Yankari. Each package is designed for thrill-seekers and nature enthusiasts.",
      cultural:
        "Nigeria's rich cultural heritage shines through in our historical tours. Explore ancient Kano city walls, visit the Benin Kingdom artifacts, experience traditional festivals in various regions, and tour historical sites in Lagos and Abuja. These packages offer deep cultural immersion.",
      weekend:
        "Perfect for quick escapes! Our weekend packages (2-3 days) include beach getaways to Calabar or Lagos, cultural tours in nearby cities, nature retreats, and city exploration packages. All designed to maximize your short break with memorable experiences.",
      luxury:
        "Our premium luxury experiences feature 5-star accommodations, private tours, gourmet dining, exclusive access to attractions, and personalized service. Destinations include luxury resorts in Lagos, premium hotels in Abuja, and exclusive safari lodges with world-class amenities.",
      beach:
        "Nigeria's coastline offers stunning beach destinations! Top picks include Calabar's pristine beaches, Lagos' Lekki and Elegushi beaches, and hidden gems along the Atlantic coast. Packages include water sports, beachfront accommodations, and seafood dining experiences.",
    };

    if (typeof query === "string") {
      return (
        responses[query as keyof typeof responses] ||
        "I understand you're looking for travel recommendations. Let me analyze your preferences and suggest the best options for you."
      );
    }

    // Custom query response
    let response =
      "Based on your travel preferences, here's what I recommend:\n\n";

    if (query.budgetMin || query.budgetMax) {
      response += `💰 Budget: I've filtered packages within your ₦${query.budgetMin?.toLocaleString() || "0"} - ₦${query.budgetMax?.toLocaleString() || "unlimited"} range.\n\n`;
    }

    if (query.startDate && query.endDate) {
      response += `📅 Travel Dates: Your trip from ${new Date(query.startDate).toLocaleDateString()} to ${new Date(query.endDate).toLocaleDateString()} is perfect for exploring Nigeria.\n\n`;
    }

    if (query.destination) {
      response += `📍 Destination: ${query.destination} is an excellent choice! I've found packages that highlight the best of this location.\n\n`;
    }

    if (query.travelers && query.travelers > 1) {
      response += `👥 Group Size: For ${query.travelers} travelers, I recommend packages with group-friendly activities and accommodations.\n\n`;
    }

    if (query.freeText) {
      response += `Based on your description: "${query.freeText}", I've curated personalized recommendations that match your interests and requirements.\n\n`;
    }

    response +=
      "The packages below are ranked by how well they match your criteria. Each includes detailed information about activities, accommodations, and what makes it special for your trip.";

    return response;
  };

  useEffect(() => {
    // Load saved preferences
    const savedPreferences = localStorage.getItem("travelPreferences");
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);
      setHasPreferences(true);
      if (!showPreferencesForm) {
        // Call generateRecommendations directly with parsed preferences
        generateRecommendations(parsed);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreferencesForm]);

  const handleQuickQuestion = async (questionId: string) => {
    const question = quickQuestions.find((q) => q.id === questionId);
    if (!question) return;

    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = generateMockAIResponse(questionId);
      setAiResponse(response);

      // Generate recommendations based on question category
      await generateRecommendationsFromQuestion(questionId);

      showToast("AI response generated!", "success");
    } catch (error) {
      showToast("Failed to process question. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customQuery.freeText.trim() && !customQuery.budgetMin) {
      showToast("Please enter your travel preferences", "error");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI processing
      // TODO: Replace with actual AI backend API call
      // Example: const response = await fetch('/api/ai/recommendations', { method: 'POST', body: JSON.stringify(customQuery) });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = generateMockAIResponse(customQuery);
      setAiResponse(response);

      // Generate recommendations based on custom query
      await generateRecommendationsFromCustomQuery(customQuery);

      showToast("AI recommendations generated!", "success");
    } catch (error) {
      showToast(
        "Failed to generate recommendations. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendationsFromQuestion = async (questionId: string) => {
    let filtered = [...mockRecommendations];

    switch (questionId) {
      case "budget-friendly":
        filtered = filtered.filter((pkg) => pkg.price < 50000);
        break;
      case "family-trips":
        filtered = filtered.filter((pkg) =>
          pkg.highlights.some((h) =>
            ["Beach", "Park", "Museum", "Educational"].some((keyword) =>
              h.includes(keyword),
            ),
          ),
        );
        break;
      case "adventure":
        filtered = filtered.filter(
          (pkg) =>
            pkg.name.includes("Adventure") ||
            pkg.name.includes("Safari") ||
            pkg.name.includes("Climbing"),
        );
        break;
      case "cultural":
        filtered = filtered.filter(
          (pkg) =>
            pkg.name.includes("Cultural") ||
            pkg.name.includes("Historical") ||
            pkg.name.includes("Heritage"),
        );
        break;
      case "weekend":
        filtered = filtered.filter((pkg) => pkg.duration <= 3);
        break;
      case "luxury":
        filtered = filtered.filter((pkg) => pkg.price > 60000);
        break;
      case "beach":
        filtered = filtered.filter((pkg) =>
          pkg.highlights.some((h) => h.toLowerCase().includes("beach")),
        );
        break;
      default:
        filtered = mockRecommendations.slice(0, 4);
    }

    setRecommendations(filtered.slice(0, maxRecommendations));
    setShowForm(false);
    setHasPreferences(true);
  };

  const generateRecommendationsFromCustomQuery = async (query: CustomQuery) => {
    let filtered = [...mockRecommendations];

    // Filter by budget
    if (query.budgetMin || query.budgetMax) {
      filtered = filtered.filter((pkg) => {
        const min = query.budgetMin || 0;
        const max = query.budgetMax || Infinity;
        return pkg.price >= min && pkg.price <= max;
      });
    }

    // Filter by destination
    if (query.destination) {
      filtered = filtered.filter((pkg) =>
        pkg.location.toLowerCase().includes(query.destination!.toLowerCase()),
      );
    }

    // Analyze free text for keywords
    if (query.freeText) {
      const text = query.freeText.toLowerCase();
      const keywords = {
        adventure: ["adventure", "hiking", "climbing", "outdoor", "active"],
        cultural: ["culture", "history", "heritage", "traditional", "museum"],
        beach: ["beach", "coast", "ocean", "sea", "water"],
        luxury: ["luxury", "premium", "5-star", "exclusive", "upscale"],
        budget: ["budget", "cheap", "affordable", "economical"],
        family: ["family", "kids", "children", "group"],
      };

      Object.entries(keywords).forEach(([category, words]) => {
        if (words.some((word) => text.includes(word))) {
          filtered = filtered.map((pkg) => {
            let score = pkg.matchScore;
            if (
              category === "adventure" &&
              (pkg.name.includes("Adventure") || pkg.name.includes("Safari"))
            )
              score += 10;
            if (
              category === "cultural" &&
              (pkg.name.includes("Cultural") || pkg.name.includes("Historical"))
            )
              score += 10;
            if (
              category === "beach" &&
              pkg.highlights.some((h) => h.toLowerCase().includes("beach"))
            )
              score += 10;
            if (category === "luxury" && pkg.price > 60000) score += 10;
            if (category === "budget" && pkg.price < 50000) score += 10;
            return { ...pkg, matchScore: Math.min(score, 100) };
          });
        }
      });
    }

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore);

    setRecommendations(filtered.slice(0, maxRecommendations));
    setShowForm(false);
    setHasPreferences(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "travelDates") {
        setPreferences((prev) => ({
          ...prev,
          travelDates: {
            ...prev.travelDates,
            [child]: value,
          },
        }));
      }
    } else {
      setPreferences((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (name: string, value: string) => {
    setPreferences((prev) => {
      const currentValues = prev[
        name as keyof RecommendationPreferences
      ] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return { ...prev, [name]: newValues };
    });
  };

  const generateRecommendations = async (prefs = preferences) => {
    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simple scoring algorithm based on preferences
      let scoredRecommendations = mockRecommendations.map((pkg) => {
        let score = 70; // Base score

        // Budget matching
        if (prefs.budget) {
          const budgetRanges = {
            budget: [0, 50000],
            "mid-range": [50000, 100000],
            luxury: [100000, 200000],
            premium: [200000, Infinity],
          };
          const range = budgetRanges[prefs.budget as keyof typeof budgetRanges];
          if (pkg.price >= range[0] && pkg.price <= range[1]) {
            score += 15;
          }
        }

        // Interest matching
        if (prefs.interests.length > 0) {
          const hasMatchingInterest = prefs.interests.some((interest) =>
            pkg.highlights.some((highlight) =>
              highlight
                .toLowerCase()
                .includes(interest.toLowerCase().split(" ")[0]),
            ),
          );
          if (hasMatchingInterest) score += 10;
        }

        // Group size consideration
        if (prefs.groupSize <= 2 && pkg.name.includes("Cultural")) score += 5;
        if (prefs.groupSize > 2 && pkg.name.includes("Adventure")) score += 5;

        return { ...pkg, matchScore: Math.min(score, 100) };
      });

      // Sort by match score and limit results
      scoredRecommendations = scoredRecommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, maxRecommendations);

      setRecommendations(scoredRecommendations);
      setShowForm(false);
      setHasPreferences(true);

      // Save preferences
      localStorage.setItem("travelPreferences", JSON.stringify(prefs));

      showToast("AI recommendations generated successfully!", "success");
    } catch (error) {
      showToast(
        "Failed to generate recommendations. Please try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateRecommendations();
  };

  if (loading) {
    return (
      <div className="ai-recommendations-loading">
        <div className="loading-content">
          <div className="ai-icon">🤖</div>
          <LoadingSpinner />
          <h3>AI is analyzing your preferences...</h3>
          <p>Finding the perfect travel packages for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      {showForm && (
        <div className="ai-assistant-container">
          <div className="form-header">
            <h2>🤖 AI Travel Assistant</h2>
            <p>
              Choose how you'd like to interact with our AI travel assistant
            </p>
          </div>

          {/* Mode Selector */}
          <div className="input-mode-selector">
            <button
              className={`mode-btn ${inputMode === "quick-questions" ? "active" : ""}`}
              onClick={() => setInputMode("quick-questions")}
            >
              <span className="mode-icon">💬</span>
              <span className="mode-label">Quick Questions</span>
            </button>
            <button
              className={`mode-btn ${inputMode === "custom-input" ? "active" : ""}`}
              onClick={() => setInputMode("custom-input")}
            >
              <span className="mode-icon">✍️</span>
              <span className="mode-label">Describe Your Trip</span>
            </button>
            <button
              className={`mode-btn ${inputMode === "structured-form" ? "active" : ""}`}
              onClick={() => setInputMode("structured-form")}
            >
              <span className="mode-icon">📋</span>
              <span className="mode-label">Detailed Form</span>
            </button>
          </div>

          {/* Quick Questions Mode */}
          {inputMode === "quick-questions" && (
            <div className="quick-questions-container">
              <h3>Ask me anything about travel:</h3>
              <div className="questions-grid">
                {quickQuestions.map((q) => (
                  <button
                    key={q.id}
                    className="question-card"
                    onClick={() => handleQuickQuestion(q.id)}
                  >
                    <span className="question-icon">{q.icon}</span>
                    <span className="question-text">{q.question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Input Mode */}
          {inputMode === "custom-input" && (
            <div className="custom-input-container">
              <h3>Tell us about your ideal trip:</h3>
              <form
                onSubmit={handleCustomQuerySubmit}
                className="custom-query-form"
              >
                {/* Free Text Input */}
                <div className="form-group">
                  <label>✨ Describe your travel preferences</label>
                  <textarea
                    value={customQuery.freeText}
                    onChange={(e) =>
                      setCustomQuery({
                        ...customQuery,
                        freeText: e.target.value,
                      })
                    }
                    placeholder="Example: I'm looking for a relaxing beach vacation with my family of 4. We love water sports and local cuisine. Budget is around 200,000 naira for a 5-day trip..."
                    rows={5}
                    className="custom-textarea"
                  />
                  <small className="form-hint">
                    Be as specific as you like! Mention budget, dates,
                    interests, activities, or anything else important to you.
                  </small>
                </div>

                {/* Optional Structured Fields */}
                <div className="optional-fields">
                  <h4>📝 Optional: Add specific details</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>💰 Budget Range (₦)</label>
                      <div className="budget-inputs">
                        <input
                          type="number"
                          placeholder="Min"
                          value={customQuery.budgetMin || ""}
                          onChange={(e) =>
                            setCustomQuery({
                              ...customQuery,
                              budgetMin: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="budget-input"
                        />
                        <span className="budget-separator">to</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={customQuery.budgetMax || ""}
                          onChange={(e) =>
                            setCustomQuery({
                              ...customQuery,
                              budgetMax: e.target.value
                                ? parseInt(e.target.value)
                                : undefined,
                            })
                          }
                          className="budget-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>📅 Start Date</label>
                      <input
                        type="date"
                        value={customQuery.startDate || ""}
                        onChange={(e) =>
                          setCustomQuery({
                            ...customQuery,
                            startDate: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label>📅 End Date</label>
                      <input
                        type="date"
                        value={customQuery.endDate || ""}
                        onChange={(e) =>
                          setCustomQuery({
                            ...customQuery,
                            endDate: e.target.value,
                          })
                        }
                        min={
                          customQuery.startDate ||
                          new Date().toISOString().split("T")[0]
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>📍 Preferred Destination</label>
                      <input
                        type="text"
                        placeholder="e.g., Lagos, Abuja, Calabar..."
                        value={customQuery.destination || ""}
                        onChange={(e) =>
                          setCustomQuery({
                            ...customQuery,
                            destination: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>👥 Number of Travelers</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={customQuery.travelers || 1}
                        onChange={(e) =>
                          setCustomQuery({
                            ...customQuery,
                            travelers: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary generate-btn">
                  🤖 Get AI Recommendations
                </button>
              </form>
            </div>
          )}

          {/* Structured Form Mode (Original) */}
          {inputMode === "structured-form" && (
            <div className="preferences-form-container">
              <form onSubmit={handleSubmit} className="preferences-form">
                {/* Budget */}
                <div className="form-group">
                  <label>💰 Budget Range</label>
                  <select
                    name="budget"
                    value={preferences.budget}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select your budget</option>
                    <option value="budget">Budget (Under ₦50,000)</option>
                    <option value="mid-range">
                      Mid-range (₦50,000 - ₦100,000)
                    </option>
                    <option value="luxury">Luxury (₦100,000 - ₦200,000)</option>
                    <option value="premium">Premium (Above ₦200,000)</option>
                  </select>
                </div>

                {/* Travel Dates */}
                <div className="form-row">
                  <div className="form-group">
                    <label>📅 Start Date</label>
                    <input
                      type="date"
                      name="travelDates.startDate"
                      value={preferences.travelDates.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label>📅 End Date</label>
                    <input
                      type="date"
                      name="travelDates.endDate"
                      value={preferences.travelDates.endDate}
                      onChange={handleInputChange}
                      min={preferences.travelDates.startDate}
                    />
                  </div>
                </div>

                {/* Group Size */}
                <div className="form-group">
                  <label>👥 Group Size</label>
                  <select
                    name="groupSize"
                    value={preferences.groupSize}
                    onChange={handleInputChange}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interests */}
                <div className="form-group">
                  <label>🎯 Interests (Select all that apply)</label>
                  <div className="checkbox-grid">
                    {interestOptions.map((interest) => (
                      <label key={interest} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={preferences.interests.includes(interest)}
                          onChange={() =>
                            handleMultiSelect("interests", interest)
                          }
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Travel Style */}
                <div className="form-group">
                  <label>✈️ Travel Style</label>
                  <select
                    name="travelStyle"
                    value={preferences.travelStyle}
                    onChange={handleInputChange}
                  >
                    <option value="">Select travel style</option>
                    <option value="relaxed">Relaxed & Leisurely</option>
                    <option value="adventure">Adventure & Active</option>
                    <option value="cultural">Cultural & Educational</option>
                    <option value="luxury">Luxury & Comfort</option>
                    <option value="backpacker">Budget & Backpacker</option>
                  </select>
                </div>

                {/* Preferred Activities */}
                <div className="form-group">
                  <label>🏃 Preferred Activities</label>
                  <div className="checkbox-grid">
                    {activityOptions.map((activity) => (
                      <label key={activity} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={preferences.activities.includes(activity)}
                          onChange={() =>
                            handleMultiSelect("activities", activity)
                          }
                        />
                        <span>{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary generate-btn">
                  🤖 Generate AI Recommendations
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* AI Response Display */}
      {aiResponse && !showForm && (
        <div className="ai-response-container">
          <div className="ai-response-header">
            <div className="ai-avatar">🤖</div>
            <div>
              <h3>AI Assistant Response</h3>
              <p className="response-timestamp">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="ai-response-content">
            <p>{aiResponse}</p>
          </div>
        </div>
      )}

      {!showForm && recommendations.length > 0 && (
        <div className="recommendations-container">
          <div className="recommendations-header">
            <h2>🎯 Your Personalized Recommendations</h2>
            <p>Based on your preferences, here are the best matches for you:</p>
            <button
              onClick={() => {
                setShowForm(true);
                setAiResponse("");
              }}
              className="btn btn-outline"
            >
              🔄 New Search
            </button>
          </div>

          <div className="recommendations-grid">
            {recommendations.map((pkg) => (
              <div key={pkg.id} className="recommendation-card">
                <div className="match-score">
                  <span>{pkg.matchScore}% Match</span>
                </div>

                <img src={pkg.image} alt={pkg.name} className="package-image" />

                <div className="package-content">
                  <h3>{pkg.name}</h3>
                  <p className="location">📍 {pkg.location}</p>
                  <p className="duration">⏱️ {pkg.duration} days</p>
                  <div className="rating">
                    ⭐ {pkg.rating} ({Math.floor(Math.random() * 50) + 10}{" "}
                    reviews)
                  </div>

                  <div className="match-reasons">
                    <h4>Why this matches you:</h4>
                    <ul>
                      {pkg.matchReasons.map((reason, index) => (
                        <li key={index}>✓ {reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="highlights">
                    <h4>Highlights:</h4>
                    <div className="highlight-tags">
                      {pkg.highlights.map((highlight, index) => (
                        <span key={index} className="highlight-tag">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="package-footer">
                    <div className="price">₦{pkg.price.toLocaleString()}</div>
                    <Link
                      to={`/packages/${pkg.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasPreferences &&
        !showForm &&
        recommendations.length === 0 &&
        !loading && (
          <div className="no-recommendations">
            <div className="no-recommendations-icon">🤖</div>
            <h3>No recommendations found</h3>
            <p>Try adjusting your preferences to get better matches.</p>
            <button
              onClick={() => {
                setShowForm(true);
                setAiResponse("");
              }}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        )}
    </div>
  );
};

export default AIRecommendations;
