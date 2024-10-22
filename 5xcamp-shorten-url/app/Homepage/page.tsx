"use client";

import React, { ChangeEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";
import { z, ZodError } from "zod";
import Loading from "./Loading";

interface FormData {
  fullLink: string;
  shortLink: string;
  note: string;
  activate: boolean;
}

const urlSchema = z.string().url("Please enter a valid URL");

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/";
const shortUrlSchema = z
  .string()
  .url("Please enter a valid URL")
  .refine((val) => val.startsWith(`${BASE_URL}`), {
    message: `The short URL must start with ${BASE_URL}`,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noteFetching, setNoteFetching] = useState<boolean>(false);

  const fetchUrlInfo = async (link: string) => {
    if (!link) return;

    try {
      urlSchema.parse(link);
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
      setIsLoading(true);

      const res = await fetch("api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullLink: link }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.shortUrl) {
          setShortLink(`${BASE_URL}${data.shortUrl}`);
          setActivate(data.activate);
        } else {
          setShortLink(`${BASE_URL}${data.generatedShortUrl}`);
          setActivate(data.activate);
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Cannot query or generate short URL.");
      } else {
        alert("Unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setFullLink(link);
    fetchUrlInfo(link);
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

  const handleCopy = () => {
    if (!shortLink) return;
    navigator.clipboard.writeText(shortLink);
    setIsCopied(true);
    setTransitionClass("");
    setTimeout(() => {
      setIsCopied(false);
      setTransitionClass("transition-all duration-1000");
    }, 1000);
  };

  const handleGetPageInfo = async () => {
    if (!fullLink) return;
    try {
      setNoteFetching(true);

      const res = await fetch("api/get-page-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullLink }),
      });
      const data = await res.json();
      if (res.ok) {
        setNote(`Title: ${data.title}\nDescription: ${data.description}`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Cannot get page info.");
      } else {
        alert("Unknown error occurred.");
      }
    } finally {
      setNoteFetching(false);
    }
  };

  const handleActiveChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newActivate = e.target.checked;
    setActivate(newActivate);
    const formattedShortLink = shortLink.replace(`${BASE_URL}`, "");
    const formData: FormData = {
      fullLink,
      shortLink: formattedShortLink,
      note,
      activate: newActivate,
    };

    try {
      const res = await fetch("/api/urls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
            onChange={handleFullLinkChange} // 使用 onChange 而非 onBlur
            required
          />
          {error && <p className="text-red-500 text-xs pl-3 pt-1">{error}</p>}
        </div>
        <div>
          <label htmlFor="shortLink" className="title block">
            短網址
          </label>
          <div className="relative flex items-center">
            {isLoading && (
              <div className="absolute left-3">
                <Loading />
              </div>
            )}
            <input
              type="text"
              name="shortLink"
              id="shortLink"
              className="input-field w-[200px] h-[40px] text-black"
              value={shortLink}
              placeholder={isLoading ? "" : "可自行填寫，或是自動產生"}
              onChange={(e) => setShortLink(e.target.value)}
              onBlur={handleShortLinkBlur}
            />
            <button
              className="absolute inset-y-0 right-0 px-4 flex items-center"
              onClick={handleCopy}
            >
              <FontAwesomeIcon
                icon={faCopy}
                className={`text-lg bg-white ${
                  isCopied ? "text-blue-600" : "text-slate-500"
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
              <FontAwesomeIcon icon={faCloudDownloadAlt} className="mr-2" />{" "}
              取得頁面資訊
            </button>
          </div>
          <div className="relative">
            {noteFetching && (
              <div className="absolute left-2 top-2">
                <Loading />
              </div>
            )}
            <textarea
              name="note"
              id="note"
              className="input-field block w-full h-[70px] text-black"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
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
            是否啟用（勾選以啟用短網址）
          </label>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
