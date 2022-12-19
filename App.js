import { View, Text, FlatList, StyleSheet, TextInput, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'

import CoinItem from './components/CoinItem'

const App = () => {

  const [coins, setCoins] = useState([])
  const [searchText, setSearchText] = useState('')
  const [refreshing, setrefreshing] = useState(false)

  const loadData = async () => {

    const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false");

    const data = await res.json();

    setCoins(data)
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#141414' />
      <View style={styles.header}>
        <Text style={styles.title}>CryptoMarket</Text>
        <TextInput
          placeholder='Search a coin...'
          placeholderTextColor={'#858585'}
          onChangeText={text => setSearchText(text)}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        onRefresh={async ()=>{
          setrefreshing(true)
          await loadData()
          setrefreshing(false)
        }}
        refreshing={refreshing}
        data={
          coins.filter((coin) => coin.name.toLowerCase().includes(searchText.toLowerCase()) || coin.symbol.toLowerCase().includes(searchText.toLowerCase()))
        }
        style={styles.list}
        renderItem={({ item }) => {
          return <CoinItem coin={item} />
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#141414',
    alignItems: 'center',
    flex: 1
  },
  title: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 20
  },
  list: {
    width: '90%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  searchInput: {
    color: '#ffffff',
    borderBottomColor: '#4657CE',
    borderBottomWidth: 1,
    width: '40%',
    textAlign: 'center',

  }
})

export default App