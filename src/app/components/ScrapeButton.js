import { useState } from 'react';
import { parsePostings } from "../helpers/parse_data"

const ScrapeButton = () => {
  const [data, setData] = useState(null);

  const handleClick = () => {
    getCachedData()
      .then((data) => {
        console.log(data)
        parsePostings(data)
        setData(data);
      })
      .catch((error) => {
        console.error("Failed to get cached data:", error);
      });
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Get Cached Data
      </button>
    </div>
  );
};

export default ScrapeButton;
