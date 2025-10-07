import Input from "@/components/atoms/Input";

const FormField = ({ label, error, required, children, ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-secondary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children || <Input error={!!error} {...props} />}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;