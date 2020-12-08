import Select from "react-select";

export function FormikMultiSelect({
  options,
  field,
  value,
  form,
  onChange,
  onBlur,
  componentName,
  isClearable,
  ...props
}) {
  const handleChange = (value) => {
    onChange(componentName, value);
  };

  const handleBlur = () => {
    onBlur(componentName, true);
  };
  return (
    <Select
      instanceId={1}
      className=" w-full -ml-2"
      isMulti={true}
      onBlur={() => handleBlur()}
      onChange={(value, name) => handleChange(value)}
      isClearable={isClearable}
      options={options}
      value={value || (value && value.items)}
    />
  );
}
