import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, Button, ActivityIndicator, StyleSheet, Dimensions, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { MealDetails } from '../../components/MealDetails';

export function Search(){
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const modalTextOpen = () => {
    setModalVisible(true);
  }

  const modalTextClose = () => {
    setModalVisible(false);
  }
 
  {/*}
  const handleSearch = (query) => {
    setIsLoading(true);
    fetch(`https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&addRecipeNutrition=true&instructionsRequired=true&number=3&query=${query}&apiKey=e095e14b3aba4f8a86d65bbbec9d5258`)
      .then((response) => response.json())
      .then((data) => {
      setSearchResults(data.results))
      console.log(setSearchResults);
  }
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };
*/}
  const handleSearch = (query) => {
    setIsLoading(true);
    fetch(`https://api.spoonacular.com/recipes/complexSearch?addRecipeInformation=true&addRecipeNutrition=true&instructionsRequired=true&number=3&query=${query}&apiKey=b932a28a292846c3b80c7bd9475e4577`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(({ results }) => {
        setSearchResults(results);
        console.log(setSearchResults);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => setIsLoading(false));
  };

  const nutrientsofInterest = ["Calories", "Fat", "Carbohydrates", "Protein"];

  if (Array.isArray(searchResults) && searchResults.length > 0) {
    searchResults.forEach((recipe) => {
      let nutrientAmounts = {};
      recipe.nutrition.nutrients.forEach((nutrient) => {
        if (nutrientsofInterest.includes(nutrient.name)) {
          if (!nutrientAmounts.hasOwnProperty(nutrient.name)) {
            nutrientAmounts[nutrient.name] = nutrient.amount;
          } else {
            nutrientAmounts[nutrient.name] += nutrient.amount;
          }
        }
      });
      recipe.nutrientAmounts = nutrientAmounts;
    });
  }

  const closeModal = () => {
    setSelectedMeal(null);
  };

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const boxWidth = windowWidth * 0.885; //prev value was 0.885
  const boxHeight = windowHeight * 0.4; //prev value was 0.2425

  return (
    // Added scrolling feature
    <ScrollView contentContainerStyle={styles.scroll_container}>
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search for Meals"
          value={query}
          onChangeText={(text) => setQuery(text)}
        />
        <Button title="Search" onPress={() => handleSearch(query)} />
      </View>
      <View style={styles.resultLayout}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="blue" />
            <Text>Loading...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View style={styles.boxLayout}>
            {searchResults && searchResults.map((recipe, index) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() => setSelectedMeal(recipe.id)}
                style={[styles.boxes, {width: boxWidth, height: boxHeight}]}
              >
                <Image source={{ uri: recipe.image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                <Text style={[{fontSize: 18}, styles.textInfo]}>{recipe.title}</Text>
                <Text style={[{fontSize: 16}, styles.textInfo]}>Calories: {recipe.nutrientAmounts["Calories"]} kcal</Text>
                <Text style={[{fontSize: 16}, styles.textInfo]}>Fat: {recipe.nutrientAmounts["Fat"]} g</Text>
                <Text style={[{fontSize: 16}, styles.textInfo]}>Carbs: {recipe.nutrientAmounts["Carbohydrates"]} g</Text>
                <Text style={[{fontSize: 16}, styles.textInfo]}>Protein: {recipe.nutrientAmounts["Protein"]} g</Text>
                {/* a popup to replace the meals */}
                <TouchableWithoutFeedback onPress={modalTextOpen}>
                <Text style={[{fontSize: 16}, styles.textInfo]}>Replace Meal</Text>
                </TouchableWithoutFeedback>
                {/* <Modal visible={modalVisible} onRequestClose={modalTextClose}>
                  <View>
                      <Text>Testingbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb text</Text>
                  </View>
                </Modal> */}
                {/* irrelevant */}
                {console.log(`Recipe ${index + 1}: ${recipe.title}`)}
              </TouchableOpacity>
            ))}
            {selectedMeal && (
              <MealDetails mealId={selectedMeal} closeModal={closeModal} />
            )}
          </View>
        ) : (
          <View style={styles.loading}>
            {!isLoading && <Text>Meals will be displayed here.</Text>}
          </View>
        )}
      </View>
    </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Regarding the SCREEN SHAKE when you scroll up, it is because some of the stuff INSIDE THE SCROLLVIEW is too large to render
  // Thus, to fix that, increase the minHeight if necessary
  scroll_container: {
    minHeight: '165%',
  },
  page: {
    flex:1, 
    flexDirection:'column', 
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16, 
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: "80%",
  },
  resultLayout: {
    flex: 1, 
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  boxLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxes: {
      backgroundColor: '#AD40AF',
      marginVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
  },
  textInfo: {
    color: "white",
  }
});