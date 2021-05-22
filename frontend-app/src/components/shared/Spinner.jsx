import React, { useEffect, useState } from 'react';

function makeSvgIcon(content) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 36 36"
    >
      {content}
    </svg>
  );
}

const SVG_ICONS = [
  makeSvgIcon(
    <>
      <circle fill="#FFD983" cx="18" cy="18" r="18"></circle>
      <g fill="#FFCC4D">
        <circle cx="10.5" cy="8.5" r="3.5"></circle>
        <circle cx="20" cy="17" r="3"></circle>
        <circle cx="24.5" cy="28.5" r="3.5"></circle>
        <circle cx="22" cy="5" r="2"></circle>
        <circle cx="3" cy="18" r="1"></circle>
        <circle cx="30" cy="9" r="1"></circle>
        <circle cx="15" cy="31" r="1"></circle>
        <circle cx="32" cy="19" r="2"></circle>
        <circle cx="10" cy="23" r="2"></circle>
      </g>
    </>
  ),
  makeSvgIcon(
    <>
      <path
        fill="#FFD983"
        d="M0 18c0 9.941 8.059 18 18 18c.295 0 .58-.029.87-.043C24.761 33.393 29 26.332 29 18C29 9.669 24.761 2.607 18.87.044C18.58.03 18.295 0 18 0C8.059 0 0 8.059 0 18z"
      ></path>
      <path
        fill="#66757F"
        d="M29 18C29 9.669 24.761 2.607 18.87.044C28.404.501 36 8.353 36 18c0 9.646-7.594 17.498-17.128 17.956C24.762 33.391 29 26.331 29 18z"
      ></path>
      <circle fill="#FFCC4D" cx="10.5" cy="8.5" r="3.5"></circle>
      <circle fill="#FFCC4D" cx="20" cy="16" r="3"></circle>
      <circle fill="#FFCC4D" cx="21.5" cy="27.5" r="3.5"></circle>
      <circle fill="#FFCC4D" cx="21" cy="6" r="2"></circle>
      <circle fill="#FFCC4D" cx="3" cy="18" r="1"></circle>
      <circle fill="#5B6876" cx="30" cy="9" r="1"></circle>
      <circle fill="#FFCC4D" cx="15" cy="31" r="1"></circle>
      <circle fill="#5B6876" cx="32" cy="19" r="2"></circle>
      <circle fill="#FFCC4D" cx="10" cy="23" r="2"></circle>
    </>
  ),
  makeSvgIcon(
    <>
      <path fill="#FFD983" d="M18 0v36C8.059 36 0 27.941 0 18S8.059 0 18 0z"></path>
      <path fill="#66757F" d="M36 18c0 9.941-8.059 18-18 18V0c9.941 0 18 8.059 18 18z"></path>
      <circle fill="#FFCC4D" cx="10.5" cy="8.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="24" cy="16" r="3"></circle>
      <circle fill="#5B6876" cx="22.5" cy="27.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="21" cy="6" r="2"></circle>
      <circle fill="#FFCC4D" cx="3" cy="18" r="1"></circle>
      <circle fill="#5B6876" cx="30" cy="9" r="1"></circle>
      <circle fill="#FFCC4D" cx="15" cy="31" r="1"></circle>
      <circle fill="#5B6876" cx="32" cy="19" r="2"></circle>
      <circle fill="#FFCC4D" cx="10" cy="23" r="2"></circle>
    </>
  ),
  makeSvgIcon(
    <>
      <circle fill="#FFD983" cx="18" cy="18" r="18"></circle>
      <path
        fill="#66757F"
        d="M36 18c0 9.941-8.059 18-18 18c-.294 0-.58-.029-.87-.043C11.239 33.393 7 26.332 7 18C7 9.669 11.239 2.607 17.13.044C17.42.03 17.706 0 18 0c9.941 0 18 8.059 18 18z"
      ></path>
      <circle fill="#5B6876" cx="25.5" cy="8.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="16" cy="16" r="3"></circle>
      <circle fill="#5B6876" cx="14.5" cy="27.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="15" cy="6" r="2"></circle>
      <circle fill="#5B6876" cx="33" cy="18" r="1"></circle>
      <circle fill="#FFCC4D" cx="6" cy="9" r="1"></circle>
      <circle fill="#5B6876" cx="21" cy="31" r="1"></circle>
      <circle fill="#FFCC4D" cx="4" cy="19" r="2"></circle>
      <circle fill="#5B6876" cx="26" cy="23" r="2"></circle>
    </>
  ),
  makeSvgIcon(
    <>
      <circle fill="#66757F" cx="18" cy="18" r="18"></circle>
      <g fill="#5B6876">
        <circle cx="10.5" cy="8.5" r="3.5"></circle>
        <circle cx="20" cy="16" r="3"></circle>
        <circle cx="21.5" cy="27.5" r="3.5"></circle>
        <circle cx="21" cy="6" r="2"></circle>
        <circle cx="3" cy="18" r="1"></circle>
        <circle cx="30" cy="9" r="1"></circle>
        <circle cx="15" cy="31" r="1"></circle>
        <circle cx="32" cy="19" r="2"></circle>
        <circle cx="10" cy="23" r="2"></circle>
      </g>
    </>
  ),
  makeSvgIcon(
    <>
      <circle fill="#FFD983" cx="18" cy="18" r="18"></circle>
      <path
        fill="#66757F"
        d="M0 18c0 9.941 8.059 18 18 18c.295 0 .58-.029.87-.043C24.761 33.393 29 26.332 29 18C29 9.669 24.761 2.607 18.87.044C18.58.03 18.295 0 18 0C8.059 0 0 8.059 0 18z"
      ></path>
      <circle fill="#5B6876" cx="10.5" cy="8.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="20" cy="16" r="3"></circle>
      <circle fill="#5B6876" cx="21.5" cy="27.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="21" cy="6" r="2"></circle>
      <circle fill="#5B6876" cx="3" cy="18" r="1"></circle>
      <circle fill="#FFCC4D" cx="30" cy="9" r="1"></circle>
      <circle fill="#5B6876" cx="15" cy="31" r="1"></circle>
      <circle fill="#FFCC4D" cx="32" cy="19" r="2"></circle>
      <circle fill="#5B6876" cx="10" cy="23" r="2"></circle>
    </>
  ),
  makeSvgIcon(
    <>
      <path fill="#FFD983" d="M18 0v36c9.941 0 18-8.059 18-18S27.941 0 18 0z"></path>
      <path fill="#66757F" d="M0 18c0 9.941 8.059 18 18 18V0C8.059 0 0 8.059 0 18z"></path>
      <circle fill="#FFCC4D" cx="25.5" cy="8.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="12" cy="16" r="3"></circle>
      <circle fill="#5B6876" cx="13.5" cy="27.5" r="3.5"></circle>
      <circle fill="#5B6876" cx="15" cy="6" r="2"></circle>
      <circle fill="#FFCC4D" cx="33" cy="18" r="1"></circle>
      <circle fill="#5B6876" cx="6" cy="9" r="1"></circle>
      <circle fill="#FFCC4D" cx="21" cy="31" r="1"></circle>
      <circle fill="#5B6876" cx="4" cy="19" r="2"></circle>
      <circle fill="#FFCC4D" cx="26" cy="23" r="2"></circle>
    </>
  ),
  makeSvgIcon(
    <>
      <path
        fill="#FFD983"
        d="M36 18c0 9.941-8.059 18-18 18c-.294 0-.58-.029-.87-.043C11.239 33.393 7 26.332 7 18C7 9.669 11.239 2.607 17.13.044C17.42.03 17.706 0 18 0c9.941 0 18 8.059 18 18z"
      ></path>
      <path
        fill="#66757F"
        d="M7 18C7 9.669 11.239 2.607 17.13.044C7.596.501 0 8.353 0 18c0 9.646 7.594 17.498 17.128 17.956C11.238 33.391 7 26.331 7 18z"
      ></path>
      <circle fill="#FFCC4D" cx="25.5" cy="8.5" r="3.5"></circle>
      <circle fill="#FFCC4D" cx="16" cy="16" r="3"></circle>
      <circle fill="#FFCC4D" cx="14.5" cy="27.5" r="3.5"></circle>
      <circle fill="#FFCC4D" cx="15" cy="6" r="2"></circle>
      <circle fill="#FFCC4D" cx="33" cy="18" r="1"></circle>
      <circle fill="#5B6876" cx="6" cy="9" r="1"></circle>
      <circle fill="#FFCC4D" cx="21" cy="31" r="1"></circle>
      <circle fill="#5B6876" cx="4" cy="19" r="2"></circle>
      <circle fill="#FFCC4D" cx="26" cy="23" r="2"></circle>
    </>
  )
];

export const Spinner = ({ className }) => {
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    let id = setInterval(() => {
      setPhrase((prev) => setPhrase((prev + 1) % SVG_ICONS.length));
    }, 100);
    return () => clearInterval(id);
  }, []);

  return <div className={className}>{SVG_ICONS[phrase]}</div>;
};
