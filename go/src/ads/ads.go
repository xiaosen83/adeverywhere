package main

import (
        "fmt"
        "flag"
        "gopkg.in/mgo.v2"
        "gopkg.in/mgo.v2/bson"
        )

func main(){
  actionPtr := flag.String("action", "assgin", "assign|delete Cars for AD")
  adidPtr := flag.String("adid", "", "AD's id")
  mongodb := flag.String("db", "127.0.0.1:27017", "mongodb server")

  flag.Parse()

  fmt.Println("action:\t", *actionPtr)
  fmt.Println("adid:\t", *adidPtr)

  testDb(*mongodb)
}

type Car struct{
  ID bson.ObjectId
  PlateNumber string
  Model string
}

func testDb(mongodb string){
  fmt.Println("mongodb:\t", mongodb)
  session, err := mgo.Dial(mongodb)
  if err != nil{
    panic(err)
  }
  defer session.Close()

  c := session.DB("cwang").C("cars")

  result := Car{}
  err = c.Find(nil).Select(bson.M{"model": 0}).One(&result)
  //err = c.Find(nil).Select(bson.M{"plate_number": 0, "model":1}).One(&result)
  if err != nil {
    panic(err)
  }
  fmt.Println("Car", result)
}

