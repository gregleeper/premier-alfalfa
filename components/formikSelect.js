import Select from "react-select";

export function FormikSelect({ options, field, form }) {
  return (
    <Select
      instanceId={1}
      id={field.name}
      className=" w-full"
      autoComplete="on"
      name={field.name}
      onBlur={field.onBlur}
      onChange={({ value }) => {
        form.setFieldValue(field.name, value);
      }}
      options={options}
      value={
        options ? options.find((option) => option.value === field.value) : ""
      }
    />
  );
}
