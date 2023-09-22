const SettingsWrapper = ({
  children,
  title,
}: {
  children: JSX.Element | (null | JSX.Element)[];
  title: string;
}) => {
  return (
    <fieldset className='.border-blue'>
      <legend>{title}</legend>
      <div className='flex flex-col gap-2 grow h-full '>{children}</div>
    </fieldset>
  );
};
export default SettingsWrapper;
