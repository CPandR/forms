type RadioInputProps = {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
};

export const RadioInput = ({ name, label, checked, onSelect }: RadioInputProps) => (
  <div>
    <label>
      <input
        className="float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        required
      />
      {label}
    </label>
  </div>
);
