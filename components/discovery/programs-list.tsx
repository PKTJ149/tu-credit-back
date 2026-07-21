"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProgramCard } from "@/components/discovery/program-card";
import { FilterSidebar, type FilterSectionConfig } from "@/components/discovery/filter-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Program } from "@/lib/discovery/types";

const ITEMS_PER_PAGE = 9;

const programs: Program[] = [
  {
    id: "p1",
    slug: "software-development",
    name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
    credits: 18,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "เส้นทางการเรียนรู้สำหรับผู้ที่ต้องการทักษะการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
    description: "หลักสูตรออกแบบมาสำหรับผู้ที่ต้องการสร้างทักษะการพัฒนาซอฟต์แวร์จากพื้นฐานถึงระดับกลาง ครอบคลุมการเขียนโปรแกรม โครงสร้างข้อมูล และการพัฒนาแอปพลิเคชันจริง",
    seats: 40,
    enrolledCount: 28,
    teachers: ["ผศ.ดร. สมชาย ใจดี", "อ.ดร. วันดี มีสุข", "อ. ประสิทธิ์ เกิดผล"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 9000,
    originalPrice: 12000,
    duration: "6 เดือน",
    qualification: "เปิดรับทั้งนักศึกษาปัจจุบันและผู้เรียนภายนอกที่มีพื้นฐานการใช้คอมพิวเตอร์เบื้องต้น",
    careerPaths: ["นักพัฒนาซอฟต์แวร์", "โปรแกรมเมอร์", "นักวิเคราะห์ระบบ", "DevOps Engineer"],
    outcomes: ["ทักษะการเขียนโปรแกรมที่นำไปใช้งานได้จริง", "ความเข้าใจหลักการพัฒนาซอฟต์แวร์อย่างเป็นระบบ", "ผลงานที่สามารถนำไปใช้ประกอบพอร์ตโฟลิโอ", "ประกาศนียบัตรรับรองจาก TU Credit Bank"],
    subjects: [
      { id: "s1", slug: "intro-programming", name: "การเขียนโปรแกรมเบื้องต้น", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "พื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น", price: 1500 },
      { id: "s4", slug: "data-structures", name: "โครงสร้างข้อมูลและอัลกอริทึม", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "หลักการจัดการข้อมูลและอัลกอริทึมพื้นฐาน", price: 1500 },
      { id: "sw3", slug: "web-development", name: "การพัฒนาเว็บแอปพลิเคชัน", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "สร้างเว็บแอปพลิเคชันด้วย React และ Next.js", price: 2000 },
      { id: "sw4", slug: "database-design", name: "ออกแบบและจัดการฐานข้อมูล", credits: 3, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "หลักการออกแบบฐานข้อมูลเชิงสัมพันธ์และ NoSQL", price: 1500 },
      { id: "sw5", slug: "software-project", name: "โครงงานพัฒนาซอฟต์แวร์", credits: 6, faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์", summary: "พัฒนาโปรเจกต์จริงภายใต้การดูแลของอาจารย์", price: 2500 },
    ],
  },
  {
    id: "p2",
    slug: "data-analytics",
    name: "หลักสูตรประกาศนียบัตรการวิเคราะห์ข้อมูล",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "เรียนรู้การวิเคราะห์และนำเสนอข้อมูลเพื่อการตัดสินใจ",
    description: "พัฒนาทักษะการวิเคราะห์ข้อมูลด้วย Python, SQL และเครื่องมือ Visualization ที่ใช้งานจริงในองค์กรชั้นนำ",
    seats: 35,
    enrolledCount: 20,
    teachers: ["รศ.ดร. วันดี มีสุข", "อ.ดร. เอกชัย ดีมาก"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 7500,
    duration: "5 เดือน",
    qualification: "มีพื้นฐานสถิติและคณิตศาสตร์เบื้องต้น",
    careerPaths: ["Data Analyst", "Business Intelligence Analyst", "Data Scientist"],
    outcomes: ["วิเคราะห์และตีความข้อมูลได้อย่างถูกต้อง", "สร้าง Dashboard สำหรับผู้บริหาร", "ใช้ Python และ SQL ในการทำงานจริง"],
    subjects: [
      { id: "s2", slug: "intro-statistics", name: "สถิติเบื้องต้นสำหรับนักวิจัย", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "หลักการทางสถิติที่ใช้ในการวิจัยเบื้องต้น", price: 1500 },
      { id: "da2", slug: "python-data", name: "Python สำหรับการวิเคราะห์ข้อมูล", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "ใช้ Python และ pandas ในการวิเคราะห์ข้อมูล", price: 1500 },
      { id: "da3", slug: "data-visualization", name: "การนำเสนอข้อมูลเชิงภาพ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "สร้าง Dashboard และกราฟที่สื่อสารข้อมูลได้ชัดเจน", price: 1500 },
      { id: "da4", slug: "sql-business", name: "SQL สำหรับการวิเคราะห์ธุรกิจ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "เขียน SQL ระดับกลาง-สูงสำหรับการวิเคราะห์ธุรกิจ", price: 1500 },
      { id: "da5", slug: "ml-intro", name: "เครื่องจักรเรียนรู้เบื้องต้น", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "แนวคิดพื้นฐานและการประยุกต์ใช้ Machine Learning", price: 1500 },
    ],
  },
  {
    id: "p3",
    slug: "digital-marketing",
    name: "หลักสูตรประกาศนียบัตรการตลาดดิจิทัล",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ปูพื้นฐานการตลาดยุคดิจิทัลสำหรับผู้ประกอบการและนักการตลาด",
    description: "เรียนรู้กลยุทธ์การตลาดดิจิทัลครบวงจร ตั้งแต่ SEO, SEM, Social Media ไปจนถึง Data-Driven Marketing",
    seats: 40,
    enrolledCount: 40,
    teachers: ["อ.ดร. สุดา รักเรียน", "อ. มานพ ตั้งใจ"],
    status: "closed",
    type: "ประกาศนียบัตร",
    totalPrice: 6000,
    duration: "4 เดือน",
    careerPaths: ["Digital Marketing Manager", "Content Creator", "Social Media Strategist"],
    outcomes: ["วางแผนกลยุทธ์การตลาดดิจิทัลได้อย่างมีประสิทธิภาพ", "ใช้เครื่องมือ Google Analytics และ Meta Ads"],
  },
  {
    id: "p4",
    slug: "public-speaking-workshop",
    name: "อบรมเชิงปฏิบัติการการพูดในที่สาธารณะ",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะศิลปศาสตร์",
    summary: "ฝึกทักษะการพูดและการนำเสนออย่างมั่นใจ",
    description: "Workshop เข้มข้น 3 วัน ฝึกพูดหน้ากล้อง นำเสนองาน และสื่อสารในที่ประชุมอย่างมืออาชีพ",
    seats: 25,
    enrolledCount: 18,
    teachers: ["ผศ. อรทัย พูดเก่ง"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 1500,
    duration: "3 วัน",
    careerPaths: ["ผู้บริหาร", "วิทยากร", "MC / พิธีกร"],
    outcomes: ["พูดนำเสนอต่อหน้าผู้ฟังได้อย่างมั่นใจ", "จัดโครงสร้างการพูดให้น่าสนใจ"],
  },
  {
    id: "p5",
    slug: "financial-literacy-workshop",
    name: "อบรมความรู้ทางการเงินเบื้องต้น",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ปูพื้นฐานการวางแผนการเงินส่วนบุคคล",
    description: "เรียนรู้หลักการบริหารเงิน งบประมาณส่วนตัว การออม และการลงทุนเบื้องต้นสำหรับคนทำงาน",
    seats: 30,
    enrolledCount: 12,
    teachers: ["อ.ดร. สมบัติ มีเงิน"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 1500,
    duration: "2 วัน",
    careerPaths: ["ผู้ประกอบการ", "นักบัญชี"],
    outcomes: ["วางแผนการเงินส่วนตัวได้อย่างเป็นระบบ", "เข้าใจหลักการลงทุนเบื้องต้น"],
  },
  {
    id: "p6",
    slug: "ai-fundamentals",
    name: "หลักสูตรประกาศนียบัตรพื้นฐานปัญญาประดิษฐ์",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "ทำความเข้าใจแนวคิดและการประยุกต์ใช้ปัญญาประดิษฐ์เบื้องต้น",
    description: "หลักสูตรครอบคลุม AI, Machine Learning และ Generative AI พร้อมฝึกประยุกต์ใช้ในงานจริง ไม่จำเป็นต้องมีพื้นฐานโค้ด",
    seats: 35,
    enrolledCount: 15,
    teachers: ["รศ.ดร. อนุชา เก่งมาก", "อ.ดร. นภา ฉลาดดี", "อ. พิทยา รู้จริง"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 7500,
    originalPrice: 9000,
    duration: "5 เดือน",
    careerPaths: ["AI Product Manager", "Prompt Engineer", "AI Consultant"],
    outcomes: ["เข้าใจแนวคิดหลักของ AI และ Machine Learning", "ประยุกต์ใช้ AI Tools ในการทำงาน"],
    subjects: [
      { id: "ai1", slug: "ai-intro", name: "ปัญญาประดิษฐ์เบื้องต้น", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "ภาพรวมของ AI, ML และ Deep Learning", price: 1500 },
      { id: "ai2", slug: "ml-fundamentals", name: "หลักการ Machine Learning", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "อัลกอริทึม ML พื้นฐานและการประยุกต์ใช้", price: 1500 },
      { id: "ai3", slug: "nlp-basics", name: "การประมวลผลภาษาธรรมชาติ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "NLP และ Large Language Models เบื้องต้น", price: 1500 },
      { id: "ai4", slug: "computer-vision", name: "Computer Vision เบื้องต้น", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "การประมวลผลภาพด้วย AI", price: 1500 },
      { id: "ai5", slug: "ai-ethics", name: "จริยธรรมและ AI ที่รับผิดชอบ", credits: 3, faculty: "คณะวิทยาศาสตร์และเทคโนโลยี", summary: "แนวทางการใช้ AI อย่างมีจริยธรรมและรับผิดชอบ", price: 1500 },
    ],
  },
  {
    id: "p7",
    slug: "ux-ui-design",
    name: "หลักสูตรประกาศนียบัตรการออกแบบ UX/UI",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะศิลปศาสตร์",
    summary: "ออกแบบประสบการณ์ผู้ใช้และ Interface สำหรับแอปพลิเคชันยุคใหม่",
    description: "เรียนรู้กระบวนการออกแบบ UX/UI แบบครบวงจรตั้งแต่ User Research, Wireframing, Prototyping ไปจนถึง Usability Testing",
    seats: 30,
    enrolledCount: 22,
    teachers: ["ผศ. อรทัย ออกแบบดี", "อ.ดร. ภัทร สร้างสรรค์"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 6000,
    duration: "4 เดือน",
    careerPaths: ["UX Designer", "UI Designer", "Product Designer", "Interaction Designer"],
    outcomes: ["ออกแบบ User Flow และ Wireframe ได้อย่างมืออาชีพ", "สร้าง Prototype ที่ทดสอบได้จริง", "ใช้ Figma และเครื่องมือออกแบบชั้นนำ"],
  },
  {
    id: "p8",
    slug: "project-management",
    name: "หลักสูตรประกาศนียบัตรการบริหารโครงการ",
    credits: 9,
    level: "ประกาศนียบัตร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "บริหารโครงการให้สำเร็จตามเป้าหมาย ตรงเวลา และอยู่ในงบประมาณ",
    description: "ครอบคลุม Agile, Scrum และ PMP Framework สำหรับการบริหารโครงการในองค์กรยุคใหม่",
    seats: 35,
    enrolledCount: 30,
    teachers: ["รศ.ดร. กิตติ บริหารเก่ง", "อ. สมศักดิ์ ทำงานดี"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 4500,
    duration: "3 เดือน",
    careerPaths: ["Project Manager", "Scrum Master", "Program Manager", "Product Owner"],
    outcomes: ["บริหารโครงการด้วย Agile และ Scrum ได้", "วางแผนและควบคุม Timeline และ Budget", "รับมือกับความเสี่ยงในโครงการ"],
  },
  {
    id: "p9",
    slug: "python-for-business",
    name: "อบรม Python สำหรับธุรกิจ",
    credits: 6,
    level: "อบรมระยะสั้น",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "ใช้ Python อัตโนมัติงานและวิเคราะห์ข้อมูลธุรกิจโดยไม่ต้องเป็นนักโปรแกรม",
    description: "เรียนรู้การใช้ Python สำหรับงาน Excel Automation, ดึงข้อมูลจาก API และสร้าง Report อัตโนมัติ",
    seats: 25,
    enrolledCount: 10,
    teachers: ["อ.ดร. ชัยวัฒน์ โค้ดเป็น"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 3000,
    originalPrice: 3500,
    duration: "2 สัปดาห์",
    careerPaths: ["Business Analyst", "Operations Manager", "นักวิเคราะห์ธุรกิจ"],
    outcomes: ["เขียน Python เบื้องต้นได้", "อัตโนมัติงานซ้ำซากด้วยโค้ด", "สร้าง Report จากข้อมูลจริงได้"],
  },
  {
    id: "p10",
    slug: "leadership-management",
    name: "หลักสูตรประกาศนียบัตรภาวะผู้นำและการบริหาร",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "พัฒนาทักษะผู้นำและการบริหารองค์กรอย่างมีประสิทธิภาพ",
    description: "หลักสูตรสำหรับผู้บริหารระดับกลาง-สูง ครอบคลุม Strategic Thinking, People Management และ Change Leadership",
    seats: 25,
    enrolledCount: 18,
    teachers: ["ศ.ดร. วิชัย นำทีมเก่ง", "รศ.ดร. สุภา บริหารดี"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 8000,
    duration: "4 เดือน",
    careerPaths: ["ผู้จัดการ", "ผู้อำนวยการ", "CEO", "หัวหน้าทีม"],
    outcomes: ["พัฒนา Leadership Style ของตนเอง", "บริหารทีมในสภาวะการเปลี่ยนแปลง", "สร้างวัฒนธรรมองค์กรที่แข็งแกร่ง"],
  },
  {
    id: "p11",
    slug: "academic-english",
    name: "อบรมภาษาอังกฤษเชิงวิชาการ",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะศิลปศาสตร์",
    summary: "พัฒนาทักษะภาษาอังกฤษสำหรับการเขียนบทความวิชาการและการนำเสนองานวิจัย",
    description: "เรียนรู้การเขียน Abstract, บทความ และ Proposal เป็นภาษาอังกฤษในระดับมาตรฐานสากล",
    seats: 30,
    enrolledCount: 15,
    teachers: ["ผศ.ดร. แมรี่ สอนดี"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 1500,
    duration: "5 วัน",
    careerPaths: ["นักวิจัย", "อาจารย์", "นักศึกษาปริญญาโท-เอก"],
    outcomes: ["เขียนบทคัดย่อภาษาอังกฤษได้", "นำเสนองานวิจัยในเวทีสากลได้", "เข้าใจ Grammar สำหรับงานวิชาการ"],
  },
  {
    id: "p12",
    slug: "healthcare-management",
    name: "หลักสูตรประกาศนียบัตรการบริหารสาธารณสุข",
    credits: 15,
    level: "ประกาศนียบัตร",
    faculty: "คณะสาธารณสุขศาสตร์",
    summary: "บริหารองค์กรสาธารณสุขและระบบบริการสุขภาพอย่างมีประสิทธิภาพ",
    description: "ครอบคลุมการบริหารโรงพยาบาล คลินิก และหน่วยงานสาธารณสุข ด้วยหลักการจัดการสมัยใหม่",
    seats: 20,
    enrolledCount: 12,
    teachers: ["รศ.ดร. สุพจน์ แพทย์ดี", "อ.ดร. นงลักษณ์ สุขภาพดี"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 7500,
    duration: "5 เดือน",
    careerPaths: ["ผู้อำนวยการโรงพยาบาล", "ผู้บริหารคลินิก", "นักวิชาการสาธารณสุข"],
    outcomes: ["บริหารองค์กรสาธารณสุขได้อย่างมีประสิทธิภาพ", "วางแผนนโยบายสุขภาพเบื้องต้นได้"],
  },
  {
    id: "p13",
    slug: "entrepreneurship",
    name: "หลักสูตรประกาศนียบัตรการเป็นผู้ประกอบการ",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "สร้างธุรกิจตั้งแต่ Idea จนถึง Launch ด้วยกระบวนการ Lean Startup",
    description: "เรียนรู้การตรวจสอบ Business Model, หาทุน และ Scale ธุรกิจในยุคดิจิทัล",
    seats: 30,
    enrolledCount: 8,
    teachers: ["ดร. ปิยวัฒน์ สร้างธุรกิจ", "อ. ณัฐพล Startup มืออาชีพ"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 6000,
    duration: "4 เดือน",
    careerPaths: ["Entrepreneur", "Startup Founder", "Business Developer", "Innovation Manager"],
    outcomes: ["เขียน Business Plan ได้", "ทดสอบ Business Model ก่อนลงทุนจริง", "เข้าถึงแหล่งทุนและ Mentor"],
  },
  {
    id: "p14",
    slug: "accounting-non-accountants",
    name: "อบรมบัญชีสำหรับผู้ที่ไม่ใช่นักบัญชี",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะพาณิชยศาสตร์และการบัญชี",
    summary: "อ่านงบการเงินและตัดสินใจทางธุรกิจด้วยความเข้าใจทางบัญชี",
    description: "เหมาะสำหรับผู้บริหาร ผู้ประกอบการ หรือนักศึกษาที่ต้องการเข้าใจภาษาของธุรกิจ",
    seats: 40,
    enrolledCount: 35,
    teachers: ["ผศ. รัชนี สอนบัญชี"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 1500,
    duration: "1 วัน",
    careerPaths: ["ผู้บริหาร", "ผู้ประกอบการ", "นักลงทุน"],
    outcomes: ["อ่านงบการเงิน 3 ชนิดได้", "วิเคราะห์สุขภาพทางการเงินของบริษัทได้เบื้องต้น"],
  },
  {
    id: "p15",
    slug: "data-science-advanced",
    name: "หลักสูตรประกาศนียบัตร Data Science ขั้นสูง",
    credits: 18,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "ก้าวจาก Data Analyst สู่ Data Scientist ด้วยเทคนิคขั้นสูง",
    description: "Deep Learning, Feature Engineering, Model Deployment และ MLOps สำหรับการใช้งานจริงในองค์กร",
    seats: 25,
    enrolledCount: 10,
    teachers: ["ศ.ดร. อนันต์ วิทยาศาสตร์ดี", "รศ.ดร. วิภา เก่งมาก", "อ.ดร. ชาตรี นักวิทย์"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 12000,
    originalPrice: 15000,
    duration: "8 เดือน",
    careerPaths: ["Data Scientist", "ML Engineer", "AI Researcher", "Analytics Lead"],
    outcomes: ["สร้างและ Deploy ML Model ได้", "ใช้ Deep Learning Framework", "จัดการ ML Pipeline ในองค์กร"],
  },
  {
    id: "p16",
    slug: "educational-technology",
    name: "หลักสูตรประกาศนียบัตรเทคโนโลยีการศึกษา",
    credits: 12,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "ออกแบบและพัฒนาสื่อการเรียนรู้ดิจิทัลที่มีประสิทธิภาพ",
    description: "ครอบคลุมการออกแบบ e-Learning, Instructional Design, LMS Administration และ Learning Analytics",
    seats: 25,
    enrolledCount: 14,
    teachers: ["ผศ.ดร. กนกพร ออกแบบการเรียน", "อ. ธนาคาร เทคโนโลยีการศึกษา"],
    status: "open",
    type: "ประกาศนียบัตร",
    totalPrice: 6000,
    duration: "4 เดือน",
    careerPaths: ["Instructional Designer", "e-Learning Developer", "Learning Experience Designer"],
    outcomes: ["ออกแบบ Online Course ได้อย่างมืออาชีพ", "ใช้ LMS และ Authoring Tools ชั้นนำ"],
  },
  {
    id: "p17",
    slug: "research-innovation",
    name: "หลักสูตรประกาศนียบัตรวิจัยและนวัตกรรม",
    credits: 9,
    level: "ประกาศนียบัตร",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "พัฒนาทักษะการวิจัยและสร้างนวัตกรรมที่ตอบโจทย์สังคม",
    description: "ตั้งแต่การกำหนด Research Question, Methodology, Data Collection จนถึงการเผยแพร่และสร้างผลกระทบ",
    seats: 20,
    enrolledCount: 9,
    teachers: ["รศ.ดร. สุวิมล วิจัยดี", "อ.ดร. ประเสริฐ นวัตกรรม"],
    status: "closed",
    type: "ประกาศนียบัตร",
    totalPrice: 4500,
    duration: "3 เดือน",
    careerPaths: ["นักวิจัย", "Innovation Manager", "R&D Specialist"],
    outcomes: ["ทำวิจัยที่มีคุณภาพและเผยแพร่ได้", "สร้างนวัตกรรมที่แก้ปัญหาจริง"],
  },
  {
    id: "p18",
    slug: "environmental-sustainability",
    name: "อบรมสิ่งแวดล้อมและความยั่งยืน",
    credits: 3,
    level: "อบรมระยะสั้น",
    faculty: "คณะวิทยาศาสตร์และเทคโนโลยี",
    summary: "เข้าใจหลักการพัฒนาอย่างยั่งยืนและการจัดการสิ่งแวดล้อมในองค์กร",
    description: "ครอบคลุม ESG Framework, Carbon Footprint, Green Business Strategy และ Circular Economy",
    seats: 50,
    enrolledCount: 20,
    teachers: ["อ.ดร. ศิรินันท์ รักโลก"],
    status: "open",
    type: "อบรมระยะสั้น",
    totalPrice: 1500,
    duration: "2 วัน",
    careerPaths: ["Sustainability Manager", "ESG Officer", "Green Business Consultant"],
    outcomes: ["วางแผน ESG Strategy เบื้องต้นได้", "คำนวณ Carbon Footprint ขององค์กรได้"],
  },
];

const levelOptions = Array.from(new Set(programs.map((p) => p.level)));
const facultyOptions = Array.from(new Set(programs.map((p) => p.faculty)));

type ProgramsListProps = {
  showHeading?: boolean;
  detailBasePath?: string;
};

export function ProgramsList({ showHeading = true, detailBasePath = "/programs" }: ProgramsListProps) {
  const [searchValue, setSearchValue] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const activeFilterCount = [levelFilter, facultyFilter, statusFilter, priceFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setLevelFilter("");
    setFacultyFilter("");
    setStatusFilter("");
    setPriceFilter("");
    setCurrentPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const filteredPrograms = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const filtered = programs.filter((program) => {
      const matchesQuery =
        query.length === 0 ||
        program.name.toLowerCase().includes(query) ||
        program.summary.toLowerCase().includes(query);
      const matchesLevel = levelFilter.length === 0 || program.level === levelFilter;
      const matchesFaculty = facultyFilter.length === 0 || program.faculty === facultyFilter;
      const matchesStatus =
        statusFilter.length === 0 ||
        (statusFilter === "เปิดรับ"
          ? program.status === "open" || program.status === undefined
          : program.status === "closed");
      const price = program.totalPrice ?? 0;
      const matchesPrice =
        priceFilter === "" ||
        (priceFilter === "ฟรี" && price === 0) ||
        (priceFilter === "≤ ฿1,500" && price <= 1500) ||
        (priceFilter === "≤ ฿5,000" && price <= 5000) ||
        (priceFilter === "≤ ฿10,000" && price <= 10000);
      return matchesQuery && matchesLevel && matchesFaculty && matchesStatus && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return (a.totalPrice ?? 0) - (b.totalPrice ?? 0);
      if (sortBy === "price-desc") return (b.totalPrice ?? 0) - (a.totalPrice ?? 0);
      if (sortBy === "newest") return (b.id > a.id ? 1 : -1);
      return 0;
    });
  }, [searchValue, levelFilter, facultyFilter, statusFilter, priceFilter, sortBy]);

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const paginatedPrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const filterSections: FilterSectionConfig[] = [
    { id: "level", label: "ระดับ", options: levelOptions, value: levelFilter, onChange: handleFilterChange(setLevelFilter) },
    { id: "faculty", label: "คณะ", options: facultyOptions, value: facultyFilter, onChange: handleFilterChange(setFacultyFilter) },
    { id: "status", label: "สถานะการรับสมัคร", options: ["เปิดรับ", "ปิดรับ"], value: statusFilter, onChange: handleFilterChange(setStatusFilter) },
    { id: "price", label: "ราคา", options: ["ฟรี", "≤ ฿1,500", "≤ ฿5,000", "≤ ฿10,000"], value: priceFilter, onChange: handleFilterChange(setPriceFilter) },
  ];

  /* page number list: show at most 5, centered on current page */
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return Array.from({ length: 5 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col gap-6">
      {showHeading && (
        <div className="flex flex-col gap-2">
          <Breadcrumb items={[{ label: "หลักสูตร" }]} />
          <h1 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
            หลักสูตรทั้งหมด
          </h1>
          <p className="text-sm leading-6 text-[var(--ink-muted)]">
            สำรวจหลักสูตรที่เปิดสอนและเปรียบเทียบข้อมูลก่อนตัดสินใจ
          </p>
        </div>
      )}

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-subtle)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="ค้นหาหลักสูตร"
            className="ui-input w-full pl-9"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition lg:hidden ${
            mobileFiltersOpen || activeFilterCount > 0
              ? "border-[color:var(--primary)] text-[color:var(--primary)]"
              : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
          }`}
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
          ตัวกรอง
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--primary)] text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter panel */}
      {mobileFiltersOpen && (
        <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-4 lg:hidden">
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {filterSections.map((section) => (
              <div key={section.id} className="border-b border-[color:var(--border)] py-3 last:border-0 sm:last:border-b">
                <p className="mb-2 text-xs font-semibold text-[var(--foreground)]">{section.label}</p>
                <div className="flex flex-wrap gap-2">
                  {section.options.map((option) => {
                    const selected = section.value === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => section.onChange(selected ? "" : option)}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          selected
                            ? "bg-[color:var(--primary)] text-white"
                            : "border border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-3 flex items-center gap-1 text-xs text-[var(--ink-subtle)] hover:text-[var(--foreground)]"
            >
              <X aria-hidden="true" className="h-3 w-3" />
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}

      {/* Desktop: sidebar + cards */}
      <div className="flex items-start gap-8">
        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block">
          <FilterSidebar
            sections={filterSections}
            onClearAll={clearAllFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Cards + pagination */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {filteredPrograms.length > 0 ? (
            <>
              {/* Result count + Sort */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-[var(--ink-muted)]">
                  {filteredPrograms.length === programs.length
                    ? `หลักสูตรทั้งหมด ${programs.length} หลักสูตร`
                    : `พบ ${filteredPrograms.length} หลักสูตร`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--ink-subtle)] shrink-0">เรียงตาม</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: "recommended", label: "แนะนำ" },
                      { id: "newest", label: "ใหม่ล่าสุด" },
                      { id: "price-asc", label: "ราคา ↑" },
                      { id: "price-desc", label: "ราคา ↓" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => { setSortBy(opt.id); setCurrentPage(1); }}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          sortBy === opt.id
                            ? "bg-[color:var(--primary)] text-white"
                            : "border border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} detailBasePath={detailBasePath} canSave={false} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-3 border-t border-[color:var(--border)] pt-6 sm:flex-row sm:justify-between">
                  {/* Range text */}
                  <p className="text-sm text-[var(--ink-muted)]">
                    แสดง{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredPrograms.length)}
                    </span>{" "}
                    จาก{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {filteredPrograms.length}
                    </span>{" "}
                    หลักสูตร
                  </p>

                  {/* Page controls */}
                  <nav aria-label="การแบ่งหน้า" className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="หน้าก่อนหน้า"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>

                    {pageNumbers[0] > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setCurrentPage(1)}
                          className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-[color:var(--border)] px-2 text-sm text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                        >
                          1
                        </button>
                        {pageNumbers[0] > 2 && (
                          <span className="px-1 text-sm text-[var(--ink-subtle)]">…</span>
                        )}
                      </>
                    )}

                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
                          page === currentPage
                            ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-white"
                            : "border-[color:var(--border)] text-[var(--ink-muted)] hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                          <span className="px-1 text-sm text-[var(--ink-subtle)]">…</span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(totalPages)}
                          className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-[color:var(--border)] px-2 text-sm text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)]"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="หน้าถัดไป"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border)] text-[var(--ink-muted)] transition hover:border-[color:var(--ring)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-8 text-center text-sm text-[var(--ink-muted)]">
              ไม่พบหลักสูตรที่ตรงกับการค้นหา ลองปรับคำค้นหาหรือตัวกรอง
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
