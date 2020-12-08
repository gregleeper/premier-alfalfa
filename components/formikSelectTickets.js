import Select from "react-select";

export function FormikSelect({ options, field, form, handleChange }) {
  return (
    <Select
      instanceId={1}
      id={field.name}
      className=" w-full -mx-2"
      autoComplete="on"
      name={field.name}
      onBlur={field.onBlur}
      onChange={({ value }) => {
        form.setFieldValue(field.name, value);
        handleChange(value);
      }}
      options={options}
      value={
        options ? options.find((option) => option.value === field.value) : ""
      }
    />
  );
}
