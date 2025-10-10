"use client";

import { useEffect, useState, useRef } from "react";
import { Globe, Hash, X, Search, Eye, Keyboard, Repeat, Sparkles } from "lucide-react";
import { standardRegions } from "@/data/countries";
import type { GameMode } from "@/components/game/SettingsBar";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  region: string;
  onRegionChange: (region: string) => void;
  questionCount: number | "all";
  onQuestionCountChange: (count: number | "all") => void;
}

type NavigationPath = ("main" | "mode" | "region" | "questions")[];

export function CommandPalette({
  isOpen,
  onClose,
  mode,
  onModeChange,
  region,
  onRegionChange,
  questionCount,
  onQuestionCountChange,
}: CommandPaletteProps) {
  const [navigationPath, setNavigationPath] = useState<NavigationPath>(["main"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, navigationPath]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setNavigationPath(["main"]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const currentView = navigationPath[navigationPath.length - 1];

  const modes = [
    { value: "visual", label: "Visual", icon: Eye },
    { value: "typing", label: "Typing", icon: Keyboard },
    { value: "reverse", label: "Reverse", icon: Repeat },
  ];

  const questionCounts: (number | "all")[] = [10, 15, 20, 30, "all"];

  // Fuzzy search function
  const fuzzyMatch = (text: string, query: string): boolean => {
    if (!query) return true;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    let textIndex = 0;
    for (let i = 0; i < lowerQuery.length; i++) {
      textIndex = lowerText.indexOf(lowerQuery[i], textIndex);
      if (textIndex === -1) return false;
      textIndex++;
    }
    return true;
  };

  const navigateTo = (view: NavigationPath[number]) => {
    setNavigationPath([...navigationPath, view]);
    setSearchQuery("");
    setSelectedIndex(0);
  };

  const navigateBack = () => {
    if (navigationPath.length > 1) {
      setNavigationPath(navigationPath.slice(0, -1));
      setSearchQuery("");
      setSelectedIndex(0);
    } else {
      onClose();
    }
  };

  const handleSelect = (category: string, value: string | number | "all") => {
    if (category === "mode") {
      onModeChange(value as GameMode);
    } else if (category === "region") {
      onRegionChange(value as string);
    } else if (category === "questions") {
      onQuestionCountChange(value as number | "all");
    }
    onClose();
    setNavigationPath(["main"]);
    setSearchQuery("");
  };

  // Get display value for region
  const getRegionDisplayValue = () => {
    if (region === "lotr") return "Middle-earth";
    const standardRegion = standardRegions.find((r) => r.id === region);
    if (standardRegion) return standardRegion.name;
    const lotrRegion = lotrRegions.find((r) => r.id === region);
    if (lotrRegion) return lotrRegion.name;
    return region;
  };

  // Get current items based on navigation path
  const getCurrentItems = () => {
    if (currentView === "main") {
      return [
        {
          id: "mode",
          icon: modes.find((m) => m.value === mode)?.icon || Eye,
          label: "Mode",
          value: mode,
        },
        {
          id: "region",
          icon: Globe,
          label: "Region",
          value: getRegionDisplayValue(),
        },
        {
          id: "questions",
          icon: Hash,
          label: "Question count",
          value: questionCount,
        },
      ].filter((item) => fuzzyMatch(item.label, searchQuery));
    }

    if (currentView === "mode") {
      return modes.filter((m) => fuzzyMatch(m.label, searchQuery));
    }

    if (currentView === "region") {
      const standardRegionOptions = standardRegions
        .filter((r) => fuzzyMatch(r.name, searchQuery))
        .map((r) => ({ ...r, type: "standard" as const }));

      const customRegionOptions = [
        {
          id: "lotr",
          name: "Middle-earth",
          icon: Sparkles,
          type: "custom" as const,
        },
      ].filter((r) => fuzzyMatch(r.name, searchQuery));

      return [...standardRegionOptions, ...customRegionOptions];
    }

    if (currentView === "questions") {
      return questionCounts.filter((count) =>
        fuzzyMatch(
          count === "all" ? "all questions" : `${count} questions`,
          searchQuery
        )
      );
    }

    return [];
  };

  const currentItems = getCurrentItems();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        navigateBack();
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
        if (currentItems.length === 0) return;

        const selected = currentItems[selectedIndex];

        if (currentView === "main") {
          const mainItem = selected as { id: string; icon: React.ComponentType; label: string; value: string | number };
          navigateTo(mainItem.id as NavigationPath[number]);
        } else if (currentView === "mode") {
          const modeItem = selected as typeof modes[number];
          handleSelect("mode", modeItem.value);
        } else if (currentView === "region") {
          const regionItem = selected as { id: string; type?: string };
          handleSelect("region", regionItem.id);
        } else if (currentView === "questions") {
          handleSelect("questions", selected as number | "all");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentView, selectedIndex, searchQuery, currentItems.length]);

  if (!isOpen) return null;

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
              placeholder={
                currentView === "main"
                  ? "Search settings..."
                  : "Search options..."
              }
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
          {currentView === "main" && (
            <div className="space-y-1">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  const mainItem = item as { id: string; icon: React.ComponentType<{ className?: string }>; label: string; value: string | number };
                  const Icon = mainItem.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={mainItem.id}
                      ref={isSelected ? selectedItemRef : null}
                      onClick={() => navigateTo(mainItem.id as NavigationPath[number])}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isSelected ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{mainItem.label}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {mainItem.value}
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

          {currentView === "mode" && (
            <div className="space-y-1">
              {currentItems.length > 0 ? (
                (currentItems as typeof modes).map((m, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      ref={isSelected ? selectedItemRef : null}
                      onClick={() => handleSelect("mode", m.value)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors flex items-center gap-2 ${
                        mode === m.value
                          ? "bg-yellow-400 text-gray-900"
                          : isSelected
                          ? "bg-gray-700 text-gray-300"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{m.label}</span>
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

          {currentView === "region" && (
            <div className="space-y-1">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  const regionItem = item as { id: string; name: string; type?: string; icon?: React.ComponentType<{ className?: string }> };
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={regionItem.id}
                      ref={isSelected ? selectedItemRef : null}
                      onClick={() => handleSelect("region", regionItem.id)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors flex items-center gap-2 ${
                        region === regionItem.id
                          ? "bg-yellow-400 text-gray-900"
                          : isSelected
                          ? "bg-gray-700 text-gray-300"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      {regionItem.icon && <regionItem.icon className="h-4 w-4" />}
                      <span className="text-sm">{regionItem.name}</span>
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

          {currentView === "questions" && (
            <div className="space-y-1">
              {currentItems.length > 0 ? (
                (currentItems as (number | "all")[]).map((count, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={count}
                      ref={isSelected ? selectedItemRef : null}
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
          {navigationPath.length > 1 ? "go back" : "close"}
        </div>
      </div>
    </div>
  );
}
