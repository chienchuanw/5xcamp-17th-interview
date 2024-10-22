"use client";

import React, { ChangeEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { z, ZodError } from "zod";

interface FormData {
  fullLink: string;
  shortLink: string;
  note: string;
  activate: boolean;
}

// Zod Validation for entering a URL
const urlSchema = z.string().url("Please enter a valid URL");

// Zod Validation for custom short URL
const shortUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .refine((val) => val.startsWith("https://chuan.w/"), {
    message: "The short URL must start with http://chuan.w/",
  });

const Homepage = () => {
  const [fullLink, setFullLink] = useState<string>("");
  const [shortLink, setShortLink] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [activate, setActivate] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [transitionClass, setTransitionClass] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [shortUrlError, setShortUrlError] = useState<string | null>(null);

  // handle copy event when clicking copy icon in frontend
  const handleCopy = () => {
    if (!shortLink) {
      // nothing happens if there is no short link
      return;
    }
    navigator.clipboard.writeText(shortLink);
    setIsCopied(true);
    setTransitionClass("");

    setTimeout(() => {
      setIsCopied(false);
      setTransitionClass("transition-all duration-1000");
    }, 1000);
  };

  const handleBlur = async () => {
    if (!fullLink) return;

    try {
      urlSchema.parse(fullLink);
      setError(null);
    } catch (e) {
      if (e instanceof ZodError) {
        setError(e.errors[0]?.message);
      } else {
        setError("Unknown error occurred");
      }
      return;
    }

    try {
      const res = await fetch("api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullLink }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.shortUrl) {
          setShortLink(data.shortUrl);
          setActivate(data.activate);
        } else {
          setShortLink(data.generatedShortUrl);
          setActivate(data.activate);
        }
      } else {
        alert(`error message: ${data.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Cannot query or generate short URL.");
      } else {
        alert("Unknown error occurred.");
      }
    }
  };

  const handleShortLinkBlur = () => {
    try {
      shortUrlSchema.parse(shortLink);
      setShortUrlError(null);
    } catch (e) {
      if (e instanceof ZodError) {
        setShortUrlError(e.errors[0]?.message);
      } else {
        setShortUrlError("Unknown error occurred.");
      }
    }
  };

  // handle submit event when pushing "Get Page Info" button in frontend
  const handleGetPageInfo = async () => {
    if (!fullLink) {
      return;
    }

    try {
      const res = await fetch("api/get-page-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: fullLink }),
      });

      const data = await res.json();
      if (res.ok) {
        setNote(`Title: ${data.title}\nDescription: ${data.description}`);
        // alert(`成功獲取 ${data.title} 頁面資訊`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Cannot not get page info.");
      } else {
        alert("Unknown error occurred.");
      }
    }
  };

  // handle submit event when toggling the "active" checkbox in frontend
  const handleActiveChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newActivate = e.target.checked;
    setActivate(newActivate);

    // create form data which will be sent to backend later
    const formData: FormData = {
      fullLink,
      shortLink,
      note,
      activate: newActivate,
    };

    try {
      const res = await fetch("/api/urls", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`錯誤： ${data.message}`);
      }
    } catch (error) {
      alert(`請求發生錯誤：${error}`);
    }
  };

  return (
    <section className="w-[640px] mx-auto mt-10 pt-5 pb-4 border-b-2">
      <div className="container flex gap-2 mx-auto h-[120px]">
        <div>
          <label htmlFor="fullLink" className="title block">
            連結
          </label>
          <input
            id="fullLink"
            name="fullLink"
            type="text"
            placeholder="請輸入或貼上完整的網址"
            className="input-field w-[400px] h-[40px] text-black"
            value={fullLink}
            onChange={(e) => setFullLink(e.target.value)}
            onBlur={handleBlur}
            required
          />
          {error && <p className="text-red-500 text-xs pl-3 pt-1">{error}</p>}
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
              className="input-field w-[200px] h-[40px] text-black"
              value={shortLink}
              placeholder="可自行填寫，或是自動產生"
              onChange={(e) => setShortLink(e.target.value)}
              onBlur={handleShortLinkBlur}
            />
            <button
              className="absolute inset-y-0 right-0 px-4 flex items-center"
              onClick={handleCopy}
            >
              <FontAwesomeIcon
                icon={faCopy}
                className={`text-lg ${
                  isCopied ? "text-red-600" : "text-slate-500"
                } ${transitionClass}`}
              />
            </button>
          </div>
          {shortUrlError && (
            <p className="text-red-500 text-xs pl-3 pt-1">{shortUrlError}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto mt-10">
        <div className="mb-3">
          <div className="flex items-center">
            <label htmlFor="note" className="title block mr-2">
              備註說明
            </label>
            <button
              className="button"
              type="button"
              onClick={handleGetPageInfo}
            >
              <FontAwesomeIcon icon={faCloudDownloadAlt} className="mr-2" />
              取得頁面資訊
            </button>
          </div>
          <textarea
            name="note"
            id="note"
            className="input-field block w-full h-[70px] text-black"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="activate"
            id="activate"
            className="w-5 h-5 accent-black mr-1"
            checked={activate}
            onChange={handleActiveChange}
          />
          <label htmlFor="activate" className="title">
            是否啟用
          </label>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
