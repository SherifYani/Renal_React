const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
