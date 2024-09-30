"use client";
import { getAllCategories } from "@/app/lib/firebase/categoryBlog/read_server";
//import CategoryFirstInternational from "../../@category_first_international/page";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from 'next/navigation';
//import CategoryFirstDomestic from "../@category_first_international/page";

const fetchCountryData = async () => {
  const categories = await getAllCategories();
  return categories;
}

export default function Sidebar({params}) {
  const pathname = usePathname();
  const initialized = useRef(false);
  const hyphenToSpace = (str) => str.replace(/-/g, ' ');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const firstCategory = countries[0]?.id;
  const [activeCategory, setActiveCategory] = useState(null);
  const routers = useRouter();
  var the_arr = pathname.split('/');
  the_arr.pop();
  const handleCategoryClick = (categoryId, e, categoryName) => {
    routers.push(`/blog/${categoryId}`);
    setActiveCategory(categoryId, e); 
  }
   
  useEffect(()=>{
      if(!initialized.current){
          initialized.current = true;    
          const getData = async () =>{
            try{
              const data = await fetchCountryData();
              setCountries(data);
              const pathname = location.pathname;
              const pathSegments = pathname.split('/').filter(segment => segment !== '');
              const lastPathSegment = pathSegments[pathSegments.length - 1];
              setActiveCategory(lastPathSegment);

              function isTouchDevice(){
                return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
              }
               
            }
            catch(error){
            }
          }
          getData();
      }
  },[]);
  return <>
  
      <a href="#" className="left-navi blog-navi position-fixed" id="btn_left_navi"><img src="/images/icon1.svg" width="32" height="30" alt="Ground spices"/></a>
      <div className="blog-category-links">
        {/* { the_arr.join('/')} */}
        <h3>Categories</h3>
          <ul className="position-relative">
              {countries?.map((category, index) =>{
                  return (                    
                    <li key={index} data-category={category?.id} onClick={(e) => handleCategoryClick(category.id, e, category?.name)} className={activeCategory === category?.id ? 'active' : '' || the_arr.join('/') === `/blog/${category?.id}` ? "active" : ""}><Link href={'#'} className={ the_arr.join('/') === `/blog/${category?.id}` ? "active" : ""}><span>{hyphenToSpace(category?.name)}</span></Link></li>                    
                  )
                }
              )}
          </ul>
      </div>
  </>
}