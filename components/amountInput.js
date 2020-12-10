const AmountInput = ({
  field,
  onChange,
  form,
  handleAmountChange,
  ...props
}) => {
  const handleChange = (event) => {
    event.preventdefault;
    console.log(event);
    onChange(field.name, event);
    handleChange(event);
  };
  return (
    <input {...field} onChange={(event) => handleChange(event)} {...props} />
  );
};

export default AmountInput;
