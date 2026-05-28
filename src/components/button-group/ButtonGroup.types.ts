export type ButtonGroupProps<T> = {
  onSelect: (arg0: T) => void;
  options: T[];
  selectedOption: T;
};
