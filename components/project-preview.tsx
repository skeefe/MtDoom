type Props = {
  title: string;
  url: string;
  thumbnail: string;
  company: string;
  projectNumber: number;
};

const ProjectPreview = ({
  title,
  url,
  thumbnail,
  company,
}: //projectNumber,
Props) => {
  return (
    <li>
      <a href={url} target="_blank" className="no-underline">
        <img
          src={thumbnail}
          className="thumbnail rounded-full mb-1 transition transform hover:scale-105 duration-150 ease-in-out m-auto"
        />
        <span className="text-sm">
          {title}
          {/* <small className="block italic">@{company}</small> */}
        </span>
      </a>
    </li>
  );
};

export default ProjectPreview;
