'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, TextField, Typography, Stack, Modal, Button } from '@mui/material'
import { deleteDoc, getDocs, setDoc, collection, doc, query, getDoc } from 'firebase/firestore'

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [itemName, setItemName] = useState('')
  const [selectedItem, setSelectedItem] = useState('')
  const [newQuantity, setNewQuantity] = useState('')

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        })
      })
      setInventory(inventoryList)
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  const removeItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 }, { merge: true })
        }
      }

      await updateInventory()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const addItem = async (item) => {
    try {
      const docRef = doc(firestore, 'inventory', item)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 }, { merge: true })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }

      await updateInventory()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const editItem = async () => {
    try {
      const quantity = parseInt(newQuantity, 10)
  
      if (quantity < 0) {
        console.error('Quantity cannot be negative.')
        return
      }
  
      const docRef = doc(firestore, 'inventory', selectedItem)
  
      if (quantity === 0) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity }, { merge: true })
      }
  
      await updateInventory()
    } catch (error) {
      console.error('Error editing item:', error)
    }
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)
  const handleOpenEdit = (itemName) => {
    setSelectedItem(itemName)
    setOpenEdit(true)
  }
  const handleCloseEdit = () => setOpenEdit(false)

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      {/* Add Item Modal */}
      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3}>
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleCloseAdd()
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>

      {/* Edit Item Modal */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3}>
          <Typography variant="h6">Edit Item Quantity</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              placeholder="New quantity"
            />
            <Button variant="outlined" onClick={() => {
              editItem()
              setNewQuantity('')
              handleCloseEdit()
            }}>Update</Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpenAdd}>Add New Item</Button>
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6" display="flex" alignItems="center" justifyContent="center">
          <Typography variant="h2" color="#333">Inventory Item</Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            inventory.map(({ name, quantity }) => (
              <Box key={name} width="100%" minHeight="150px" display="flex" alignItems="center" justifyContent="space-between" backgroundColor="#f0f0f0" padding={5}>
                <Typography variant="h3" color="#333" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => handleOpenEdit(name)}>Edit</Button>
                  <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  )
}
