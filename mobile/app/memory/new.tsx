import { useEffect, useState } from 'react'
import { View, Text, Switch, TextInput, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link, useRouter, useLocalSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker'
import { Video, ResizeMode } from 'expo-av'
import Icon from '@expo/vector-icons/Feather'

import NlwLogo from '../../src/assets/nlw-logo.svg'
import { api } from '../../src/lib/api'

export default function NewMemory() {
  const { editId, type } = useLocalSearchParams()

  useEffect(() => {
    if (editId) {
      ;(async () => {
        const spacetimeToken = await SecureStore.getItemAsync('spacetimeToken')
        const response = await api.get(`/memories/${editId}`, {
          headers: {
            Authorization: `Bearer ${spacetimeToken}`,
          },
        })
        setMemoryContent(response.data.content)
        setIsMemoryPublic(response.data.is_public)

        if (response.data.cover_url) {
          setCurrentExistingImage(response.data.cover_url)
          setFilePreview({
            uri: response.data.cover_url,
            type: type as string,
          })
        }
      })()
    }
  }, [editId, type])

  const [isMemoryPublic, setIsMemoryPublic] = useState<boolean>(false)
  const [filePreview, setFilePreview] = useState({
    uri: '',
    type: '',
  })
  const [currentExistingImage, setCurrentExistingImage] = useState('')
  const [memoryContent, setMemoryContent] = useState('')
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()

  async function handleOpenImagePicker() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    })

    if (!result.canceled) {
      setFilePreview({
        uri: result.assets[0].uri,
        type: result.assets[0].type,
      })
    } else {
      setFilePreview({
        uri: '',
        type: '',
      })
    }
  }

  async function handleCreateNewMemory() {
    const spacetimeToken = await SecureStore.getItemAsync('spacetimeToken')

    let cover_url = ''

    if (filePreview.uri && filePreview.uri !== currentExistingImage) {
      const uploadFormData = new FormData()
      uploadFormData.append('file', {
        name: `fakeFileFormat.${filePreview.uri.split('.').pop()}`,
        type: `image/${filePreview.uri.split('.').pop()}`,
        uri: filePreview.uri,
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      cover_url = uploadResponse.data.fileURL
    }

    if (currentExistingImage || type === 'empty') {
      const imageToUpdate =
        filePreview.uri !== currentExistingImage
          ? cover_url || null
          : currentExistingImage || undefined
      await api.put(
        `memories/${editId}`,
        {
          cover_url: imageToUpdate,
          content: memoryContent,
          is_public: isMemoryPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${spacetimeToken}`,
          },
        },
      )
    } else {
      await api.post(
        '/memories',
        {
          cover_url: cover_url.length ? cover_url : undefined,
          content: memoryContent,
          is_public: isMemoryPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${spacetimeToken}`,
          },
        },
      )
    }

    setMemoryContent('')
    setIsMemoryPublic(false)
    setFilePreview({
      uri: '',
      type: '',
    })
    router.push('/memory/all')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NlwLogo />
        <Link href="/memory/all" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isMemoryPublic}
            onValueChange={setIsMemoryPublic}
            thumbColor={isMemoryPublic ? '#9b79ea' : '#9e9ea0'}
            trackColor={{ false: '#767577', true: '#372560' }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        {filePreview.type === 'video' && (
          <Video
            className="h-32 w-full rounded-lg"
            source={{ uri: filePreview.uri }}
            resizeMode={ResizeMode.COVER}
            useNativeControls
          />
        )}

        <TouchableOpacity
          className={`items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20 ${
            filePreview.type === 'video' ? 'px-5 py-3' : 'h-32'
          }`}
          activeOpacity={0.7}
          onPress={handleOpenImagePicker}
        >
          {filePreview.uri ? (
            filePreview.type === 'image' ? (
              <Image
                source={{ uri: filePreview.uri }}
                alt=""
                className="h-full w-full rounded-lg"
              />
            ) : (
              <Text className="font-body text-sm text-gray-200">
                Mudar Mídia
              </Text>
            )
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          value={memoryContent}
          onChangeText={setMemoryContent}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-3"
          onPress={handleCreateNewMemory}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
