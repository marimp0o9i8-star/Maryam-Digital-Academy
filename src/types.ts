/**
 * Types and interfaces for the Interactive Comprehensive Guide to Digital Products.
 */

export interface BookPage {
  id: number;
  title: string;
  hasHeader: boolean;
  isCover?: boolean;
  isIndex?: boolean;
  contentHtml?: string; // fallback or simple pages
  category: "intro" | "unit1" | "unit2" | "unit3" | "unit4" | "unit5" | "bonuses" | "outro";
}

export interface WorksheetAnswers {
  // Unit 1 answers
  u1Problem: string;
  u1Customer: string;
  u1Solution: string;
  u1Format: "pdf" | "templates" | "mini-course" | "files" | "";
  u1Check1: boolean;
  u1Check2: boolean;
  u1Check3: boolean;

  // Unit 2 answers
  u2SelectedIdea: string;
  u2Gathered: boolean;
  u2Structured: boolean;
  u2Designed: boolean;
  u2CreatedPdf: boolean;
  u2AddedCover: boolean;
  u2ReadyToSell: boolean;

  // Unit 3 answers
  u3StorePlatform: "gumroad" | "payhip" | "shopify" | "other" | "";
  u3ProductName: string;
  u3ProductPrice: string;
  u3ProductDescription: string;

  // Unit 4 answers
  u4MarketingPosts: boolean;
  u4WhatsappMessage: boolean;
  u4SevenDayPlan: boolean;
  u4ChecklistSharedContent: boolean;
  u4ChecklistReachedOut: boolean;
  u4ChecklistSentLink: boolean;

  // Unit 5 answers
  u5BrandName: string;
  u5ThankYouMessage: string;
  u5NextIdea: string;
  u5PricingPlan: boolean;
  u5NewProductIdeaChecked: boolean;
  u5EmailListChecked: boolean;
}

export interface DayTask {
  day: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface ProductIdea {
  id: number;
  title: string;
  type: string;
  description: string;
  demand: "high" | "medium" | "easy";
  category: "marketing" | "productivity" | "lifestyle" | "templates" | "general" | "cooking";
}

export interface TikTokScript {
  id: number;
  hook: string;
  contentTemplate: string; // text with placeholders like {niche}, {pain_point}, etc.
  category: string;
}

export interface CopiableTemplate {
  id: number;
  title: string;
  fileType: "Word" | "Excel" | "PDF";
  description: string;
  previewContent: string;
}

export interface SalesMessageTemplate {
  id: number;
  title: string;
  templateText: string; // with placeholders
}

export interface ToolItem {
  name: string;
  use: string;
  price: string;
  freeOption: boolean;
  badge: string;
  description: string;
}

export interface PromptItem {
  id: number;
  textTemplate: string; // with placeholders
  category: "content" | "marketing" | "writing" | "ads" | "productivity" | "miscellaneous";
}
