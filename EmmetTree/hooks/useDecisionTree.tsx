import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useNetInfo } from "@react-native-community/netinfo";


const BASE_URL = 'http://ppat-2019-team-emmet.herokuapp.com';
// const BASE_URL = 'http://localhost:5000';
const TREE_KEY = '@TREE';

export interface ICategory {
    id: string,
    title: string
    details?: string,
    next: string,
    color: string,
}

export interface IOption {
    text: string,
    order: number,
    next?: string
}

export interface IQuestion {
    id: string,
    text: string,
    options: IOption[]
}

export interface IDecisionTree {
    id: string,
    version: string
    categories: ICategory[]
    questions: IQuestion[]
}

const useDecisionTree = () => {
    const [treeText, setTreeText] = useState<IDecisionTree>();
    const netInfo = useNetInfo();

    /**
     * This effect runs upon initialization of this custom
     * hook and it runs only once, the idea is that if we 
     * can't load the tree the first time, that other parts
     * of the application will handle redundancies to have
     * the client load the tree
     */
    useEffect(() => {
        loadTree();
    }, [])

    const loadTree = async () => {
        try {
            let storageTreeText = await retrieveTreeFromStorage();

            let storageTreeJson: IDecisionTree = JSON.parse(storageTreeText);

            setTreeText(storageTreeJson);
        } catch (e) {
            alert(e);
        }
    }

    const retrieveTreeFromWeb = async () => {
        return fetch(BASE_URL + '/getAll')
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error('Network request failed with status: ' + res.status + ' and message: ' + res.statusText)
                }
            })
            .catch(error => {
                throw error;
            })
        // console.debug(netInfo);
        // if (netInfo.isInternetReachable) {
        //     console.debug("Internet is reachable!");
        //     return fetch(BASE_URL + '/getAll')
        //         .then(res => {
        //             return res.json()
        //         })
        //         .catch(error => {
        //             console.log("unable to get tree")
        //             console.log("blah");
        //             return null
        //         })
        // } else if (netInfo.isConnected) {
        //     throw Error("Device is connected to a network, but is unable to reach the website to download most recent version of the decision tree. Please make sure the device has internet access.");
        // } else {
        //     throw Error("Device does not appear to be connected to any network. The decision tree is not stored on the device right now, so we are unable to display anything.");
        // }

    }

    /**
     * Attempts to load decision tree from storage 
     * by selecting key TREE_KEY, if it's unable to
     * load the tree or if nothing is stored at 
     * TREE_KEY, the method will attempt to get the
     * tree from the website
     */
    const retrieveTreeFromStorage = async () => {
        try {
            // it's important to use await here!
            const treeText = await AsyncStorage.getItem(TREE_KEY);

            if (treeText !== null) {
                return treeText;
            } else {
                console.debug("Unable to retrieve decision tree from storage, attempting to retrieve online.");
                const webResponseObject = await retrieveTreeFromWeb();
                console.debug("Response received from online, storing response now.");

                return await storeTreeToStorage(webResponseObject);
                // alert("Unable to acquire from storage");
            }

        } catch (e) {
            throw (e)
        }
    }

    const refreshTreeFromWeb = async () => {
        let originalVersion = treeText.version;

        try {
            await removeTreeFromStorage();

            await loadTree();
        } catch (e) {
            throw e;
        }
    }

    const removeTreeFromStorage = async () => {
        try {
            await AsyncStorage.removeItem(TREE_KEY);
        } catch (e) {
            throw e;
        }
    }

    /**
     * Provided with the tree object, will store it
     * to device's storage
     * 
     * NOTE this is not encrypted, so if you care about this
     * being encrypted (@HIPAA) then I suggest encrypting
     * this information somehow lol
     */
    const storeTreeToStorage = async (tree) => {
        try {
            if (typeof tree === "string") {
                await AsyncStorage.setItem(TREE_KEY, tree)
                return tree;
            } else {
                let stringForm = JSON.stringify(tree);
                await AsyncStorage.setItem(TREE_KEY, stringForm)
                return stringForm;
            }
        } catch (e) {
            throw e
        }
    }

    return { treeText, refreshTreeFromWeb };
    // return treeText
}

export default useDecisionTree;