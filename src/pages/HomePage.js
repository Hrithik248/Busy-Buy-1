import { useEffect, useState } from 'react';
import {collection, getDocs} from 'firebase/firestore';
import Spinner from 'react-spinner-material';
import style from '../styles/HomePage.module.css';
import spinnerStyle from '../styles/Spinner.module.css';
import { db } from '../config/firebaseInit';
import ProductCard from '../components/ProductCard';
export default function HomePage(){
    //state for keeping track of price slider in filter
    const [priceRange,setPriceRange]=useState(700000);
    //searching field for searching products
    const [searchField,setSearchField]=useState('');
    //state for saving selected categories in filter
    const [selectedCategory,setSelectedCategory]=useState([]);
    //state for saving list of products available
    const [prodList,setProdList]=useState([]);
    //state for keep filtered products according to filter states
    const [searchAndFilterResult,setSearchAndFilterResults]=useState([]);
    //loading state for showing spinner
    const [isLoading,setLoading]=useState(true);
    //fectching product list
    useEffect(()=>{
        async function fetchProducts(){
            const querySnapshot= await getDocs(collection(db,'products'));
            const fetchedList=querySnapshot.docs.map((prod)=>{
                return {id:prod.id,...prod.data()};
            })
            //list of all products available
            setProdList(fetchedList);
            //products shown on the screen which will be all the products on mount
            setSearchAndFilterResults(fetchedList);
            //disable the spinner
            setLoading(false);
        }
        fetchProducts();
    },[]);
    //filtering the product based on search field and fliters applied
    useEffect(()=>{
        let filteredList=prodList;
        //if search feild is not empty then filter the products according to that
        if(searchField!==''){
            filteredList=searchAndFilterResult.filter((prod)=>{
                return prod.name.toLowerCase().includes(searchField.toLowerCase());
            })
        }
        //if some category is selected from filter
        if(selectedCategory.length!==0){
            filteredList=filteredList.filter((prod)=>selectedCategory.includes(prod.category));
            console.log(filteredList);
        }
        //filter based on price slider
        filteredList=filteredList.filter((prod)=>prod.price<=priceRange);
        setSearchAndFilterResults(filteredList);
    },[searchField,priceRange,selectedCategory]);
    //setting selected category array state on selecting any category checkbox
    function handleCheckCategory(category){
        const index=selectedCategory.findIndex((cat)=>cat===category);
        const newSelectedCategory=[...selectedCategory];
        if(index===-1){
            newSelectedCategory.push(category);
        }
        else{
            newSelectedCategory.splice(index,1);
        }
        console.log(newSelectedCategory);
        setSelectedCategory(newSelectedCategory);
    }
    return (
        isLoading?<Spinner radius={200} stroke={5} className={spinnerStyle.spinner} color={'#2874f0'} visible={isLoading} />:
        <div className={style.homeCon} >
            <div className={style.filterCon} >
                <div className={style.filter} >
                    <h3>Filter</h3>
                    <p>Price:{priceRange}</p>
                    <input className={style.priceInput} type='range' 
                        value={priceRange}
                        onChange={(e)=>setPriceRange(e.target.value)}
                        min={600}
                        max={700000} />
                </div>
                <div className={style.category} >
                    <h3>Category</h3>
                    <div>
                        <input type="checkbox" id="clothing" onChange={()=>handleCheckCategory('Clothing')} />
                        <label htmlFor="clothing">Clothing</label>
                    </div>
                    <div>
                        <input type="checkbox" id="electronics" onChange={()=>handleCheckCategory('Electronics')} />
                        <label htmlFor="electronics">Electronics</label>
                    </div>
                    <div>
                        <input type="checkbox" id="footwear" onChange={()=>handleCheckCategory('Footwear')} />
                        <label htmlFor="footwear">Footwear</label>
                    </div>
                    <div>
                        <input type="checkbox" id="jewellery" onChange={()=>handleCheckCategory('Jewellery')} />
                        <label htmlFor="jewellery">Jewellery</label>
                    </div>
                </div>
            </div>
            <div className={style.prodCon} >
                <input className={style.searchBar} type='search' value={searchField} onChange={(e)=>setSearchField(e.target.value)} placeholder='Search by Name' />
                <div className={style.prodList} >
                    {
                        searchAndFilterResult.map((prod,ind)=>(
                            <ProductCard product={prod} key={ind} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}