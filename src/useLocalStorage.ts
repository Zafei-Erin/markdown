// 传入key和空数组，返回key对应的initial value或最新value和key的操作方法。

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T[] | (()=>T)) {
    // 检查是否已有数据，把对应值给value
    const [value, setValue] = useState<T>(()=>{
        const jsonValue = localStorage.getItem(key)
        if (jsonValue == null) {
            // 初始化为func则调用，否则直接赋值
            if (typeof initialValue === "function") {
                return (initialValue as ()=>T)()
            } else {
                return initialValue
            }
        } else {
            return JSON.parse(jsonValue)
        }
    })

    // 若数据有变，存入localstorage
    useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    // 返回数据和对应操作方法
    return [value, setValue] as [T, typeof setValue]
}