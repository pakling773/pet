import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { IAnimal } from "../../common/interface/animal.interface";
import { environment } from "../../environment/environment";
import { isEmpty } from "lodash";

interface IFormInput {
  name: string;
  color: string;
  age: number;
  price: number;
  breed_id: number;
  description: string;
  short_description: string;
  photos: File[];
  gender: string;
}

interface AnimalBreed {
  id: number;
  name: string;
}

interface AnimalImage {
  id: number;
  image: string;
  animal_id: number;
}

function PetFormComponent() {
  const history = useHistory();
  let { id } = useParams<any>();
  console.log(id);
  // var dogImages = "";
  const [dogImages, setDogImages] = useState("");

  const [breedId, setBreedId] = useState(0);

  const [msg, setMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [breeds, setBreeds] = useState<AnimalBreed[] | null>([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [animalImages, setAnimalImages] = useState<AnimalImage[] | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<IFormInput>();

  useEffect(() => {
    getAnimalDetails();
    getAnimalBreeds();
  }, []);

  const getAnimalDetails = () => {
    console.log("get animal");
    if (!isEmpty(id)) {
      axios
        .get(environment.endpoint + "animal/get/" + id)
        .then((response) => {
          const result = response.data.data[0] as IAnimal;

          setValue("name", result?.name);
          setValue("color", result?.color);
          setValue("age", result?.age);
          setValue("price", result?.price);
          setValue("breed_id", result?.breed_id);
          setValue("gender", result?.gender);

          setValue("description", result?.description);
          setValue("short_description", result?.short_description);

          axios
            .get(environment.endpoint + "animal/photos/" + result.id)
            .then((res) => {
              const data = res.data.images as AnimalImage[];

              if (data.length >= 1) {
                // const petImages = data.map(
                //   (pet) => environment.basepath + "uploads/" + pet.image
                // );
                setAnimalImages(data);
              }
            });

          setBreedId(result?.breed_id);
        })
        .catch((error) => {
          setMsg("Failed to get breeds");
        });
    }
  };

  const getAnimalBreeds = async (): Promise<void> => {
    try {
      const response = await axios.get(environment.endpoint + "breed/list");
      const result = response.data.data ?? ([] as AnimalBreed[]);

      if (result?.length >= 1) {
        setBreeds(result);
      }
    } catch (error) {
      setMsg("Failed to get breeds");
    }
  };

  const handleFileInputChange = (event): void => {
    const files = event.target.files;
    const imagesArray = [];

    for (let i = 0; i < files.length; i++) {
      const imageUrl = URL.createObjectURL(files[i]);
      imagesArray.push(imageUrl);
    }

    setSelectedImageFiles([...selectedImageFiles, ...files]);

    setSelectedImages([...selectedImages, ...imagesArray]);
  };

  const removeImage = (index, imageId?: number) => {
    if (!window.confirm("Are you sure to delete this photo")) {
      return false;
    }
    if (imageId !== null && id !== null) {
      axios
        .get(environment.endpoint + "animal/delete/photos/" + imageId)
        .then((_) => {
          const updatedAnimalImages = animalImages.filter(
            (_, i) => i !== index
          );

          setAnimalImages(updatedAnimalImages);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      const updatedImages = selectedImages.filter((_, i) => i !== index);
      const updatedFiles = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updatedImages);
      setSelectedImageFiles(updatedFiles);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setIsSubmitting(true);

    const requestOptions = {
      name: data.name,
      color: data.color,
      age: data.age,
      price: data.price,
      breed_id: data.breed_id,
      description: data.description,
      short_description: data.short_description,
      gender: data.gender,
    };

    if (
      (!selectedImages || selectedImages.length === 0) &&
      (!animalImages || animalImages.length === 0)
    ) {
      return;
    }

    const requestFunction = id ? axios.put : axios.post;
    const url = id ? `animal/update/${id}` : "animal/save";
    console.log(url);
    requestFunction(environment.endpoint + url, requestOptions)
      .then((res) => {
        console.log(res);

        const animalID = res.data.id;
        console.error(animalID);

        if (selectedImageFiles?.length >= 1) {
          const formData = new FormData();
          for (let i = 0; i < selectedImageFiles?.length; i++) {
            formData.append("photos", selectedImageFiles[i]);
          }
          const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
          };

          axios
            .post(
              environment.endpoint + `animal/photos/${id || res.data.id}`,
              formData,
              { headers }
            )
            .then(async (response) => {
              console.log(response);

              if (id) {
                const facebook = await axios.get(
                  environment.endpoint + "/animal/facebook-post/" + animalID
                );
                console.log(facebook);
              }

              setSelectedImageFiles([]);
            })
            .catch((error) => setMsg(error));
        }

        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setIsSubmitting(false);
          history.goBack();
        }, 2000);
      })
      .catch((error) => {
        setIsSubmitting(false);
        setMsg(error);
      });
  };

  const onDeleteAnimal = async () => {
    if (!window.confirm("Are you sure do you wanna delte this pet?")) {
      return false;
    }
    try {
      if (id !== null) {
        const response = await axios.delete(
          environment.endpoint + "animal/delete/" + id
        );
        if (response.data.success === true) {
          history.goBack();
        }
      }
    } catch (error) {
      console.log(error);
      setMsg(error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const fetchImages = async () => {
    // const breedNameArr = breeds.filter((row, i) => row.id == breedId);
    const breedName = $("#breed_id_select").find(":selected").text(); //// breedNameArr[0].name;
    console.log(breedName);
    if (breedName == "Select a breed first") {
      alert("Please select a breed first");
      return false;
    }

    const data = await fetch(
      `https://dog.ceo/api/breed/${breedName}/images/random/3`
    );
    const { message, status } = await data.json();
    console.log(message);

    var img_div = "";

    if (status == "success") {
      message.map((image, i) => {
        var img = `<div class="dog-image col-md-4">
            <img src="${image}" />
            </div>`;
        img_div = img_div + img;
      });
    }

    setDogImages(img_div);

    // call http to save images
  };

  return (
    <>
      {showPopup && (
        <div className="form-success-toast">
          <img
            className="close-icon"
            src="/img/icon/white-remove-icon.svg"
            alt="Close"
            onClick={closePopup}
          />
          <div className="toast-body">
            {id !== null
              ? "Pet Updated Successfully!"
              : "Pet Added Successfully!"}
          </div>
        </div>
      )}
      <section className="contact-area  pb-110">
        <div className="container">
          <div className="container-inner-wrap">
            <div className="row justify-content-center ">
              <div className="col-12">
                <div className="contact-title mb-20">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="sub-title">Adoption</h5>
                    {id !== null && (
                      <button
                        className="btn rounded-btn  justify-content-center"
                        onClick={onDeleteAnimal}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <h2 className="title ">
                    Fill Your Pet Information<span>.</span>
                  </h2>
                  <div className="error-input"> {msg}</div>
                </div>
                <div className="contact-wrap-content">
                  <form
                    className="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="row">
                      <div className=" col-12 col-md-6">
                        <div className="form-grp mb-3">
                          <label htmlFor="name" className="">
                            Name <span>*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            {...register("name", {
                              required: true,
                              maxLength: 20,
                            })}
                            placeholder="Enter your name"
                          />
                          {errors.name && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-grp mb-3">
                          <label htmlFor="color" className="">
                            Color <span>*</span>
                          </label>
                          <input
                            type="text"
                            id="color"
                            {...register("color", {
                              required: true,
                              maxLength: 20,
                            })}
                            placeholder="Enter your color"
                          />
                          {errors.color && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 col-12">
                        <div className="form-grp mb-3">
                          <label htmlFor="age" className="">
                            Age <span>*</span>
                          </label>
                          <input
                            type="number"
                            id="age"
                            placeholder="Enter your age"
                            {...register("age", {
                              required: true,
                              maxLength: 20,
                            })}
                          />
                          {errors.age && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 col-12">
                        <div className="form-grp mb-3">
                          <label htmlFor="price" className="">
                            Adoption Fee <span>*</span>
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            placeholder="Enter your price"
                            {...register("price", {
                              required: true,
                              maxLength: 20,
                            })}
                          />
                          {errors.price && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-4 col-12">
                        <div className="form-grp mb-3">
                          <label htmlFor="price" className="">
                            Gender <span>*</span>
                          </label>
                          <select
                            className="form-select "
                            aria-label="breed select"
                            name="gender"
                            style={{
                              width: "100%",
                              background: "#f5f2eb",
                              border: "none",
                              fontSize: "14px",
                              padding: "15px 20px",
                              borderRadius: "5px",
                              display: "block",
                              fontWeight: 400,
                            }}
                            {...register("gender", {
                              required: true,
                              maxLength: 20,
                            })}
                            defaultValue=""
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Male(Desexed)">Male(Desexed)</option>
                            <option value="Female">Female</option>
                            <option value="Female(Desexed)">
                              Female(Desexed)
                            </option>
                          </select>
                          {errors.gender && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 col-12">
                        <div className="form-grp mb-3">
                          <label htmlFor="address_line_1" className="">
                            Breed <span>*</span>
                          </label>

                          <select
                            className="form-select "
                            aria-label="breed select"
                            name="breed_id"
                            id="breed_id_select"
                            style={{
                              width: "100%",
                              background: "#f5f2eb",
                              border: "none",
                              fontSize: "14px",
                              padding: "15px 20px",
                              borderRadius: "5px",
                              display: "block",
                              fontWeight: 400,
                            }}
                            {...register("breed_id", {
                              required: true,
                              maxLength: 20,
                            })}
                          >
                            <option value="">Select a breed first</option>
                            {breeds?.map((breed, index) => {
                              return (
                                <option key={breed.id} value={breed.id}>
                                  {breed.name}
                                </option>
                              );
                            })}
                          </select>
                          {errors.breed_id && (
                            <span className="error-input">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 col-12">
                        <button
                          type="button"
                          className="btn rounded-btn  justify-content-center"
                          onClick={fetchImages}
                          style={{ marginTop: "32px" }}
                        >
                          Check Dog Image Reference
                        </button>
                      </div>
                    </div>
                    <div className="form-grp mb-3">
                      <div className="  col-12">
                        <div
                          className="row dog-images"
                          dangerouslySetInnerHTML={{ __html: dogImages }}
                        ></div>
                      </div>
                    </div>

                    <div className="form-grp mb-3">
                      <label htmlFor="description" className="">
                        Description <span>*</span>
                      </label>

                      <textarea
                        className="form-control"
                        placeholder="Fill your pet's  description"
                        id="description"
                        style={{ height: "100px" }}
                        {...register("description", { required: true })}
                      ></textarea>
                      {errors.description && (
                        <span className="error-input">
                          This field is required
                        </span>
                      )}
                    </div>

                    <div className="form-grp mb-3">
                      <label htmlFor="short_description" className="">
                        Short Description <span>*</span>
                      </label>

                      <textarea
                        className="form-control"
                        placeholder="Fill your pet's short description"
                        id="floatingTextarea2"
                        name="short_description"
                        style={{ height: "100px" }}
                        {...register("short_description", { required: true })}
                      ></textarea>
                      {errors.short_description && (
                        <span className="error-input">
                          This field is required
                        </span>
                      )}
                    </div>

                    {/* Image upload here */}
                    <div className="form-grp mb-3">
                      <div
                        className="card p-3"
                        style={{
                          background: "#f5f2eb",
                        }}
                      >
                        <label htmlFor="animalImages">
                          Images <span>*</span>
                        </label>
                        <div
                          className="row"
                          style={{
                            rowGap: "20px",
                          }}
                        >
                          <div className="col-sm-3 col-4">
                            <div
                              className="card image-upload-card"
                              onClick={() =>
                                document.getElementById("animalImages").click()
                              }
                            >
                              <img
                                src="/img/icon/plus-icon.svg"
                                style={{ width: "16px", height: "16px" }}
                                alt="Plus"
                              />
                              <input
                                className="form-control d-none"
                                type="file"
                                id="animalImages"
                                multiple
                                onChange={handleFileInputChange}
                              />
                            </div>
                          </div>

                          {/* Display selected images */}
                          {animalImages?.map((image, index) => (
                            <div key={index} className="col-sm-3 col-4">
                              <div className="card image-upload-card ">
                                <img
                                  className="remove-image-icon"
                                  src="/img/icon/remove-icon.svg"
                                  alt="Remove"
                                  onClick={() => removeImage(index, image?.id)}
                                />
                                <img
                                  className="h-100 w-100 object-cover"
                                  src={
                                    environment.basepath +
                                    "uploads/" +
                                    image?.image
                                  }
                                  alt={`Uploaded  ${index + 1}`}
                                  style={{ objectFit: "cover" }}
                                />
                              </div>
                            </div>
                          ))}
                          {selectedImages.map((imageUrl, index) => (
                            <div key={index} className="col-sm-3 col-4">
                              <div className="card image-upload-card ">
                                <img
                                  className="remove-image-icon"
                                  src="/img/icon/remove-icon.svg"
                                  alt="Remove"
                                  onClick={() => removeImage(index)}
                                />
                                <img
                                  className="h-100 w-100 object-cover"
                                  src={imageUrl}
                                  alt={`Uploaded  ${index + 1}`}
                                  style={{ objectFit: "cover" }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        {isSubmitted &&
                          (!selectedImages || selectedImages.length === 0) &&
                          (!animalImages || animalImages.length === 0) && (
                            <span className="error-input mt-2">
                              This field is required
                            </span>
                          )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn mt-4 rounded-btn w-100 justify-content-center"
                    >
                      {id !== null ? "Save" : "Add"}
                      {isSubmitting &&
                        !(
                          (!selectedImages || selectedImages.length === 0) &&
                          (!animalImages || animalImages.length === 0)
                        ) && (
                          <>
                            &nbsp;
                            <div
                              className="spinner-grow text-primary spinner-grow-sm bg-white"
                              // style={{ background: "#f04336" }}
                              role="status"
                            ></div>
                          </>
                        )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PetFormComponent;
