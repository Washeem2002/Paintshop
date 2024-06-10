'use client'
import {createContext, useRef,useState,useEffect} from "react";
import square from "@/reducers/square";
import circle from "@/reducers/circle";
import roumbus from "@/reducers/roumbus";
import arrow from "@/reducers/arrow";
import line from "@/reducers/line";
import brush from "@/reducers/brush";
import image from "@/reducers/image";
import eracer from "@/reducers/erracer";
export  const User=createContext(null);
export const AppWrapper=({children})=>{
    const ref=useRef(null);
    const ref2=useRef(null);
    // --which tool
    const [tno,settno]=useState(0);
    //--end
    //key
    const [word,setword]=useState(["|"]);

    //key-end
    const [draw,setdraw]=useState(false);
    const [erace,seterace]=useState(false);
    const [x,setx]=useState(null);
    const [y,sety]=useState(null);
    const [img_data,setimg_data]=useState(null);
    const [text,settext]=useState(false);
    
   const [img,setimg]=useState(null);

    const cl=(e)=>{
      if(tno==6)
        {
           if(!text)
            {   const canvas = ref.current;
                const ctx = canvas.getContext("2d");
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX ;
                const y = e.clientY ;
                ctx.lineWidth=3
                setx(x);
                sety(y);
                ctx.save();
                const image=ctx.getImageData(0, 0, canvas.width, canvas.height);
                setimg_data(image)

                    setword(["|"]);
                    settext(!text);}

                    else{
                      setword((word)=>{return word.slice(0,-1)});
                      
                    }
                    
                    return;
        }


      const canvas = ref.current;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX ;
      const y = e.clientY ;
      ctx.lineWidth=3
      setx(x);
      sety(y);
      ctx.save();
      const image=ctx.getImageData(0, 0, canvas.width, canvas.height);
      setimg_data(image)

      
      setdraw(true);
     
      if(tno==5)
        {
          ctx.beginPath();
          ctx.moveTo(x,y);
        }
        if(tno==8)
          {
            ctx.clearRect(x-15,y-15,30,30)
          }
        
       
    }
    const rect=(e)=>{
      e.preventdefault;
       if(draw)
        {

          switch(tno){
            case 0:
              square(e,img_data,x,y,ref);
              break;
            case 1:
              circle(e,img_data,x,y,ref);
              break;
            case 2:
              roumbus(e,img_data,x,y,ref);
              break;
            case 3:
              arrow(e,img_data,x,y,ref);
              break;
            case 4:
              line(e,img_data,x,y,ref);
              break;
            case 5:
              brush(e,img_data,x,y,ref);  
              break;
            case 7:
              image(e,img_data,x,y,ref,img);
              break;
            case 8:
              eracer(e,ref);
              break;





          }
         
            
        }
    }
  
    // rectangle
    const clearcan=()=>{
      seterace(!erace);
     
    }
    useEffect(() => {
      const canvas = ref.current;
      if (canvas) {
        canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
      }
      
    }, []);
   

    /// case 6

    useEffect(()=>{
         const key=(e)=>{
          if(e.key=='Backspace')
            {
              setword((word)=>{
                
                
              const arr=  word.slice(0,-2);
              return [...arr,"|"];
              
              
              })
            }
         else{
          
          
          setword((prevWord) => {
            const newWord = prevWord.slice(0, -1); // Remove the cursor
            return [...newWord, e.key, "|"]; // Add new key and cursor
          });
        
        
        
        }}
         
        window.addEventListener('keydown',key)
        return(()=>{
          window.removeEventListener('keydown',key)
        })
    },[])


    useEffect(()=>{

       if(text)
         {
          
           const canvas = ref.current;
           const ctx = canvas.getContext("2d");
           ctx.fillStyle = 'black';
           ctx.clearRect(0, 0, canvas.width, canvas.height);
           ctx.putImageData(img_data, 0, 0);
      ctx.font = "48px serif";


      let string="";
      let x_t=x;
      let y_t=y;
      for(let i=0;i<word.length;i++)
        {
          if(word[i]==="Enter")
            {
              ctx.fillText(string,x_t,y_t);
              y_t+=48;
              string="";
            }
            else
            {
              string+=word[i];
            }
        }
       ctx.fillText(string, x_t, y_t);
        if(word[word.length - 1]!=="|")
        {
           settext(false);
         }
       
         }
     
    },[word])
    const close=()=>{
      setdraw(false)
    }
    
//  case 6
    
    const t=90
    return(
      <User.Provider value={{t,ref,ref2,cl,rect,setdraw,tno,settno,setimg}}>
         {children}
      </User.Provider>
    )
}