"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, Globe, Hash, X, Search } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  region: string;
  onRegionChange: (region: string) => void;
  questionCount: number | "all";
  onQuestionCountChange: (count: number | "all") => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  region,
  onRegionChange,
  questionCount,
  onQuestionCountChange,
}: CommandPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "region" | "questions" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, selectedCategory]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedCategory(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Get current filtered items
      const currentItems = !selectedCategory
        ? mainMenuItems
        : getFilteredOptions();

      if (e.key === "Escape") {
        e.preventDefault();
        if (selectedCategory) {
          setSelectedCategory(null);
          setSearchQuery("");
          setSelectedIndex(0);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < currentItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : currentItems.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (!selectedCategory && mainMenuItems.length > 0) {
          const selected = mainMenuItems[selectedIndex];
          setSelectedCategory(selected.id as "region" | "questions");
          setSearchQuery("");
          setSelectedIndex(0);
        } else if (selectedCategory && currentItems.length > 0) {
          const selected = currentItems[selectedIndex];
          if (selectedCategory === "region") {
            handleSelect("region", (selected as any).value);
          } else if (selectedCategory === "questions") {
            handleSelect("questions", selected as number | "all");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedCategory, selectedIndex, searchQuery, onClose]);

  if (!isOpen) return null;

  const regions = [
    { value: "all", label: "All regions" },
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "africa", label: "Africa" },
    { value: "north-america", label: "North America" },
    { value: "south-america", label: "South America" },
    { value: "oceania", label: "Oceania" },
  ];
  const questionCounts: (number | "all")[] = [10, 15, 20, 30, "all"];

  // Fuzzy search function
  const fuzzyMatch = (text: string, query: string): boolean => {
    if (!query) return true;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // Simple fuzzy matching: check if all characters appear in order
    let textIndex = 0;
    for (let i = 0; i < lowerQuery.length; i++) {
      textIndex = lowerText.indexOf(lowerQuery[i], textIndex);
      if (textIndex === -1) return false;
      textIndex++;
    }
    return true;
  };

  const handleSelect = (category: string, value: string | number | "all") => {
    if (category === "region") {
      onRegionChange(value as string);
    } else if (category === "questions") {
      onQuestionCountChange(value as number | "all");
    }
    onClose();
    setSelectedCategory(null);
    setSearchQuery("");
  };

  // Filter main menu items
  const mainMenuItems = [
    { id: "region", icon: Globe, label: "Region", value: region === "all" ? "All regions" : region },
    { id: "questions", icon: Hash, label: "Question count", value: questionCount },
  ].filter(item => fuzzyMatch(item.label, searchQuery));

  // Filter options based on category
  const getFilteredOptions = () => {
    if (selectedCategory === "region") {
      return regions.filter(r => fuzzyMatch(r.label, searchQuery));
    } else if (selectedCategory === "questions") {
      return questionCounts.filter(count =>
        fuzzyMatch(count === "all" ? "all questions" : `${count} questions`, searchQuery)
      );
    }
    return [];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black bg-opacity-60">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        {/* Search Input */}
        <div className="p-3 border-b border-gray-700">
          <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={selectedCategory ? "Search options..." : "Search settings..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-500 hover:text-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-2 max-h-96 overflow-y-auto">
          {!selectedCategory ? (
            // Main menu
            <div className="space-y-1">
              {mainMenuItems.length > 0 ? (
                mainMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedCategory(item.id as "region" | "questions");
                        setSearchQuery("");
                        setSelectedIndex(0);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isSelected
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{item.label}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {item.value}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>
          ) : selectedCategory === "region" ? (
            // Region options
            <div className="space-y-1">
              {getFilteredOptions().length > 0 ? (
                (getFilteredOptions() as typeof regions).map((r, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={r.value}
                      onClick={() => handleSelect("region", r.value)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        region === r.value
                          ? "bg-yellow-400 text-gray-900"
                          : isSelected
                          ? "bg-gray-700 text-gray-300"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <span className="text-sm">{r.label}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>
          ) : (
            // Question count options
            <div className="space-y-1">
              {getFilteredOptions().length > 0 ? (
                (getFilteredOptions() as (number | "all")[]).map((count, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={count}
                      onClick={() => handleSelect("questions", count)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        questionCount === count
                          ? "bg-yellow-400 text-gray-900"
                          : isSelected
                          ? "bg-gray-700 text-gray-300"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <span className="text-sm">
                        {count === "all" ? "All questions" : `${count} questions`}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="p-3 border-t border-gray-700 text-xs text-gray-500 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-900 rounded">esc</kbd> to{" "}
          {selectedCategory ? "go back" : "close"}
        </div>
      </div>
    </div>
  );
}
