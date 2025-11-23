import { categoryMap, CDN_URL } from "../utils/constants";

export const setCategoryElement = (element: HTMLElement, value: string) => {
  element.textContent = value;

  for (const category in categoryMap) {
    const className = categoryMap[category as keyof typeof categoryMap];
    element.classList.toggle(className, category === value);
  }
};

type SetImageElement = {
  element: HTMLImageElement;
  value: string;
  alt: string;
};

export const setImageElement = ({ element, value, alt }: SetImageElement) => {
  const url = `${CDN_URL}${value}`;
  element.src = url;
  element.alt = alt;
};
