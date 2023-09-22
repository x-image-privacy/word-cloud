type Props = {
  id: string;
  value: boolean;
  label: string;
  onChange: () => void;
};
const CheckBoxSetting = ({ onChange, id, label, value }: Props) => {
  return (
    <div>
      <input
        id={id}
        name='showWordBounds'
        type='checkbox'
        checked={value}
        onChange={onChange}
      />
      <label className='ml-1' htmlFor={id}>
        {label}
      </label>
    </div>
  );
};
export default CheckBoxSetting;
