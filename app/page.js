'use client'
import Image from "next/image";
import {useState, useEffect} from "react"
import {firestore} from "@/firebase";
import {Box, Modal, Typography, Stack, TextField, Button} from "@mui/material"
import {collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore"

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [editItemName, setEditItemName] = useState('')
    const [editQuantity, setEditQuantity] = useState('')
    const [search, setSearch] = useState('')

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc)=> {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            })
        })
        setInventory(inventoryList)
    }

    const addItem = async (item) =>{
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()) {
            const {quantity} = docSnap.data()
            await setDoc(docRef, {quantity: quantity + 1})
        }
        else{
            await setDoc(docRef, {quantity: 1})
        }
        await updateInventory()
    }

    const removeItem = async (item) =>{
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)

        if(docSnap.exists()) {
            const {quantity} = docSnap.data()
            if (quantity === 1){
                await deleteDoc(docRef)
            }
            else{
                await setDoc(docRef, {quantity: quantity - 1})
            }
        }
        await updateInventory()
    }

    const editItem = async (item, quantity) => {
        const docRef = doc(collection(firestore, 'inventory'), item)
        await setDoc(docRef, {quantity: parseInt(quantity)})
        await updateInventory()
    }

    useEffect(()=> {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const handleEditOpen = (name, quantity) => {
        setEditItemName(name)
        setEditQuantity(quantity)
        setEditOpen(true)
    }
    const handleEditClose = () => setEditOpen(false)


    return (
        <Box width="100vw"
             height="100vh"
             display="flex"
             flexDirection="column"
        >
            <Box flexGrow={1}
                 display="flex"
                 flexDirection="column"
                 justifyContent="center"
                 alignItems="center"
                 gap={2}
            >
                <Modal open={open} onClose={handleClose}>
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        width={400}
                        bgcolor="white"
                        border="2px solid #000"
                        boxShadow={24}
                        p={4}
                        display="flex"
                        flexDirection="column"
                        gap={3}
                        sx={{
                            transform: "translate(-50%,-50%)",
                        }}
                    >
                        <Typography variant="h6">Add Item</Typography>
                        <Stack width="100%" direction="row" spacing={2}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={itemName}
                                onChange={(e) => {
                                    setItemName(e.target.value)
                                }}
                            />
                            <Button
                                variant="outlined"
                                onClick={()=> {
                                    addItem(itemName)
                                    setItemName('')
                                    handleClose()
                                }}
                            >Add
                            </Button>
                        </Stack>
                    </Box>
                </Modal>

                <Modal open={editOpen} onClose={handleEditClose}>
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        width={400}
                        bgcolor="white"
                        border="2px solid #000"
                        boxShadow={24}
                        p={4}
                        display="flex"
                        flexDirection="column"
                        gap={3}
                        sx={{
                            transform: "translate(-50%,-50%)",
                        }}
                    >
                        <Typography variant="h6">Edit Item</Typography>
                        <Stack width="100%" direction="row" spacing={2}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={editQuantity}
                                onChange={(e) => {
                                    setEditQuantity(e.target.value)
                                }}
                            />
                            <Button
                                variant="outlined"
                                onClick={()=> {
                                    editItem(editItemName, editQuantity)
                                    setEditQuantity('')
                                    handleEditClose()
                                }}
                            >Update
                            </Button>
                        </Stack>
                    </Box>
                </Modal>

                <TextField
                    variant="outlined"
                    label="Search Inventory"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 400, mb: 2 }}
                />

                <Button variant = "contained"
                        onClick={() => {
                            handleOpen()
                        }}>Add New Item
                </Button>
                <Box border="1px solid #333">
                    <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
                        <Typography variant = 'h2' color = '#333'>
                            Inventory Items
                        </Typography>
                    </Box>
                    <Stack width="800px" height="300px" spacing={2} overflow="auto">
                        {inventory
                            .filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()))
                            .map(({name, quantity})=> (
                                <Box key={name}
                                     width="100%"
                                     minheight="150px"
                                     display="flex"
                                     alignItems="center"
                                     justifyContent="space-between"
                                     bgColor="#f0f0f0"
                                     padding={5}>
                                    <Typography variant='h3' color = '#333' textAlign="center">
                                        {name.charAt(0).toUpperCase() + name.slice(1)}
                                    </Typography>
                                    <Stack direction="row" spacing={2}>

                                        <Typography variant='h3' color = '#333' textAlign="center">
                                            {quantity}
                                        </Typography>
                                        <Button variant="contained" onClick={() => {
                                            addItem(name)
                                        }}>Add</Button>
                                        <Button variant="contained" onClick={() => {
                                            removeItem(name)
                                        }}>Remove</Button>
                                        <Button variant="contained" onClick={() => {
                                            handleEditOpen(name, quantity)
                                        }}>Edit</Button>

                                    </Stack>
                                </Box>

                            ))}
                    </Stack>
                </Box>
            </Box>
            <Box width="100%" bgcolor="grey" p={2} display="flex" justifyContent="center">
                <Typography variant="body1" color="white">
                    Simple Pantry Inventory Tracker | Developed by Christian Dorsey | <a href="https://www.cdorsey.dev" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', marginLeft: 4 }}>
                    cdorsey.dev
                </a>
                </Typography>
            </Box>
        </Box>
    )
}
