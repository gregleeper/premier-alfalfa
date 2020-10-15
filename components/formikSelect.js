import Select from "react-select";

export function FormikSelect({ options, field, form }) {
  return (
    <Select
      instanceId={1}
      className=" w-full"
      name={field.name}
      onBlur={field.onBlur}
      onChange={({ value }) => {
        form.setFieldValue(field.name, value);
        console.log(value);
      }}
      options={options}
      value={
        options ? options.find((option) => option.value === field.value) : ""
      }
    />
  );
}
