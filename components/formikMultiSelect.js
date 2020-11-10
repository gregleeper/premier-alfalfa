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
  console.log(value);
  const handleChange = (value) => {
    onChange(componentName, value);
  };

  const handleBlur = () => {
    onBlur(componentName, true);
  };
  return (
    <Select
      instanceId={1}
      className=" w-full"
      isMulti={true}
      onBlur={() => handleBlur()}
      onChange={(value, name) => handleChange(value)}
      isClearable={isClearable}
      options={options}
      value={value || (value && value.items)}
    />
  );
}
