/**
 * The publish lifecycle, in one place.
 *
 * `PublishState` is declared in `types.ts`, but the two content areas built in
 * parallel each supplied their own Thai labels and tones for it — and they
 * disagreed twice over: "แบบร่าง" vs "ฉบับร่าง", and draft rendered neutral on
 * one screen and pending on the other. A staff member moving between the news
 * list and the help centre saw the same state as a different word in a
 * different colour. This module is the single answer, and it is the pattern
 * `lib/finance/payment-state.ts` already set: a state and its presentation
 * travel together.
 */

import type { StatusTone } from "@/components/admin/status-badge";
import type { PublishState } from "./types";

/** "ฉบับร่าง" over "แบบร่าง": these are documents and articles, not sketches. */
export const publishStateLabel: Record<PublishState, string> = {
  draft: "ฉบับร่าง",
  scheduled: "ตั้งเวลาเผยแพร่",
  published: "เผยแพร่แล้ว",
  archived: "เก็บถาวร",
};

/**
 * Tones follow the vocabulary in `status-badge.tsx`, where `action` means *you*
 * must do something now. Neither a draft nor a scheduled post qualifies: a
 * draft is simply unfinished, and a scheduled one is waiting on the clock. Both
 * were over-signalled in one of the original copies.
 */
export const publishStateTone: Record<PublishState, StatusTone> = {
  draft: "neutral",
  scheduled: "pending",
  published: "positive",
  archived: "neutral",
};

/** What a ผู้เรียน actually sees for each state. Shown next to the state
 *  control so nobody has to guess what saving as a draft does. */
export const publishStateLearnerEffect: Record<PublishState, string> = {
  draft: "ผู้เรียนยังไม่เห็นรายการนี้ แก้ไขได้อย่างอิสระ",
  scheduled: "ผู้เรียนจะเห็นรายการนี้อัตโนมัติเมื่อถึงวันและเวลาที่ตั้งไว้",
  published: "ผู้เรียนเห็นรายการนี้บนเว็บไซต์แล้วในขณะนี้",
  archived: "ผู้เรียนไม่เห็นรายการนี้อีก แต่ข้อมูลยังเก็บไว้สำหรับตรวจสอบย้อนหลัง",
};
