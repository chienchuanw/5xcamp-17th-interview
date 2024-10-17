import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";

const homepage = () => {
  return (
    <section className="w-[640px] mx-auto mt-10 pt-5 pb-4 border-b-2">
      <div className="container flex gap-2 mx-auto">
        <div>
          <label htmlFor="fullLink" className="title block">
            連結
          </label>
          <input
            id="fullLink"
            name="fullLink"
            type="text"
            placeholder="請輸入或貼上完整的網址"
            className="input-field w-[400px] h-[40px]"
          />
        </div>
        <div>
          <label htmlFor="shortLink" className="title block">
            短網址
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="shortLink"
              id="shortLink"
              className="input-field w-[200px] h-[40px]"
            />
            <button className="absolute inset-y-0 right-0 px-4 flex items-center">
              <FontAwesomeIcon
                icon={faCopy}
                className="text-lg text-slate-600"
              />
            </button>
          </div>
          <p className="note">可自行填寫，或是自動產生</p>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="mb-3">
          <div className="flex items-center">
            <label htmlFor="note" className="title block mr-2">
              備註說明
            </label>
            <button className="button">
              <FontAwesomeIcon icon={faCloudDownloadAlt} className="mr-2" />
              取得頁面資訊
            </button>
          </div>
          <textarea
            name="note"
            id="note"
            className="input-field block w-full h-[70px]"
          ></textarea>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="activate"
            id="activate"
            className="w-5 h-5 accent-black mr-1"
          />
          <label htmlFor="activate" className="title">
            是否啟用
          </label>
        </div>
      </div>
    </section>
  );
};

export default homepage;
