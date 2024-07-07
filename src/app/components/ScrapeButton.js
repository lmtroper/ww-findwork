import { useState } from 'react';
import { parsePostings } from "../helpers/parse_data"

const extensionId = "ijmmbpioejdfnlbghgeonddkajmjccpm";

function getCachedData() {
  return new Promise((resolve, reject) => {
    if (!chrome.runtime) {
      reject("chrome.runtime is not available");
      return;
    }

    chrome.runtime.sendMessage(
      extensionId,
      { action: "getCachedData" },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      }
    );
  });
}

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
